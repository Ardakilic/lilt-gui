package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx             context.Context
	transcodingCmd  *exec.Cmd
	transcodingLock sync.Mutex
	isTranscoding   bool
}

// TranscodeConfig holds the transcoding configuration
type TranscodeConfig struct {
	LiltBinary       string `json:"liltBinary"`
	SoxBinary        string `json:"soxBinary"`
	SoxNgBinary      string `json:"soxNgBinary"`
	FfmpegBinary     string `json:"ffmpegBinary"`
	FfprobeBinary    string `json:"ffprobeBinary"`
	UseDocker        bool   `json:"useDocker"`
	OutputFormat     string `json:"outputFormat"`
	NoPreserveMetadata bool `json:"noPreserveMetadata"`
	CopyImages       bool   `json:"copyImages"`
	SourceDir        string `json:"sourceDir"`
	TargetDir        string `json:"targetDir"`
}

// ConfigData holds the persistent configuration
type ConfigData struct {
	LastConfig TranscodeConfig `json:"lastConfig"`
	Language   string          `json:"language"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// shutdown is called when the app is closing
func (a *App) shutdown(ctx context.Context) {
	// Stop transcoding if running
	a.StopTranscoding()
}

// SelectFile opens a file picker dialog
func (a *App) SelectFile(title string) (string, error) {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: title,
	})
	return file, err
}

// SelectDirectory opens a directory picker dialog
func (a *App) SelectDirectory(title string) (string, error) {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: title,
	})
	return dir, err
}

// FindInPath searches for an executable in the system PATH
func (a *App) FindInPath(executableName string) (string, error) {
	// Add .exe extension on Windows
	if runtime.GOOS == "windows" && !strings.HasSuffix(executableName, ".exe") {
		executableName += ".exe"
	}

	path, err := exec.LookPath(executableName)
	if err != nil {
		return "", fmt.Errorf("%s not found in PATH", executableName)
	}
	return path, nil
}

// StartTranscoding starts the lilt transcoding process
func (a *App) StartTranscoding(config TranscodeConfig) error {
	a.transcodingLock.Lock()
	defer a.transcodingLock.Unlock()

	if a.isTranscoding {
		return fmt.Errorf("transcoding is already in progress")
	}

	// Validate configuration
	if config.LiltBinary == "" {
		return fmt.Errorf("lilt binary path is required")
	}
	if config.SourceDir == "" {
		return fmt.Errorf("source directory is required")
	}
	if config.TargetDir == "" {
		return fmt.Errorf("target directory is required")
	}

	// Build command arguments
	args := []string{config.SourceDir}
	args = append(args, "--target-dir", config.TargetDir)

	if config.UseDocker {
		args = append(args, "--use-docker")
	}

	if config.OutputFormat != "" && config.OutputFormat != "default" {
		args = append(args, "--enforce-output-format", config.OutputFormat)
	}

	if config.NoPreserveMetadata {
		args = append(args, "--no-preserve-metadata")
	}

	if config.CopyImages {
		args = append(args, "--copy-images")
	}

	// Create command
	cmd := exec.Command(config.LiltBinary, args...)
	
	// Set environment variables for external tools if not using Docker
	if !config.UseDocker {
		env := os.Environ()
		
		// Add SoX to PATH if specified
		if config.SoxBinary != "" {
			soxDir := filepath.Dir(config.SoxBinary)
			env = append(env, "PATH="+soxDir+string(os.PathListSeparator)+os.Getenv("PATH"))
		}
		
		// Add SoX-NG to PATH if specified
		if config.SoxNgBinary != "" {
			soxNgDir := filepath.Dir(config.SoxNgBinary)
			env = append(env, "PATH="+soxNgDir+string(os.PathListSeparator)+os.Getenv("PATH"))
		}
		
		// Add FFmpeg to PATH if specified
		if config.FfmpegBinary != "" {
			ffmpegDir := filepath.Dir(config.FfmpegBinary)
			env = append(env, "PATH="+ffmpegDir+string(os.PathListSeparator)+os.Getenv("PATH"))
		}
		
		cmd.Env = env
	}

	// Create pipes for output
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return fmt.Errorf("failed to create stdout pipe: %w", err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return fmt.Errorf("failed to create stderr pipe: %w", err)
	}

	// Start the command
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start transcoding: %w", err)
	}

	a.transcodingCmd = cmd
	a.isTranscoding = true

	// Stream output to frontend
	go a.streamOutput(stdout, "stdout")
	go a.streamOutput(stderr, "stderr")

	// Wait for command to finish in a goroutine
	go func() {
		err := cmd.Wait()
		a.transcodingLock.Lock()
		a.isTranscoding = false
		a.transcodingCmd = nil
		a.transcodingLock.Unlock()

		if err != nil {
			runtime.EventsEmit(a.ctx, "transcoding-error", err.Error())
		} else {
			runtime.EventsEmit(a.ctx, "transcoding-complete", "Transcoding completed successfully!")
		}
	}()

	return nil
}

// streamOutput reads from a pipe and emits events to the frontend
func (a *App) streamOutput(pipe interface {
	Read(p []byte) (n int, err error)
}, outputType string) {
	buf := make([]byte, 1024)
	for {
		n, err := pipe.Read(buf)
		if n > 0 {
			output := string(buf[:n])
			runtime.EventsEmit(a.ctx, "transcoding-output", map[string]string{
				"type": outputType,
				"data": output,
			})
		}
		if err != nil {
			break
		}
	}
}

// StopTranscoding stops the running transcoding process
func (a *App) StopTranscoding() error {
	a.transcodingLock.Lock()
	defer a.transcodingLock.Unlock()

	if !a.isTranscoding || a.transcodingCmd == nil {
		return fmt.Errorf("no transcoding process is running")
	}

	if err := a.transcodingCmd.Process.Kill(); err != nil {
		return fmt.Errorf("failed to stop transcoding: %w", err)
	}

	a.isTranscoding = false
	a.transcodingCmd = nil
	return nil
}

// IsTranscoding returns whether transcoding is currently running
func (a *App) IsTranscoding() bool {
	a.transcodingLock.Lock()
	defer a.transcodingLock.Unlock()
	return a.isTranscoding
}

// SaveConfig saves the configuration to disk
func (a *App) SaveConfig(data ConfigData) error {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Errorf("failed to get config directory: %w", err)
	}

	appConfigDir := filepath.Join(configDir, "lilt-gui")
	if err := os.MkdirAll(appConfigDir, 0755); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	configFile := filepath.Join(appConfigDir, "config.json")
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	if err := os.WriteFile(configFile, jsonData, 0644); err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}

// LoadConfig loads the configuration from disk
func (a *App) LoadConfig() (ConfigData, error) {
	var data ConfigData

	configDir, err := os.UserConfigDir()
	if err != nil {
		return data, fmt.Errorf("failed to get config directory: %w", err)
	}

	configFile := filepath.Join(configDir, "lilt-gui", "config.json")
	
	// If config file doesn't exist, return default config
	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		data.Language = "en"
		data.LastConfig.UseDocker = true
		data.LastConfig.OutputFormat = "flac"
		data.LastConfig.CopyImages = true
		return data, nil
	}

	jsonData, err := os.ReadFile(configFile)
	if err != nil {
		return data, fmt.Errorf("failed to read config file: %w", err)
	}

	if err := json.Unmarshal(jsonData, &data); err != nil {
		return data, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return data, nil
}

// OpenURL opens a URL in the default browser
func (a *App) OpenURL(url string) error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default: // linux and others
		cmd = exec.Command("xdg-open", url)
	}

	return cmd.Start()
}

// GetVersion returns the application version
func (a *App) GetVersion() string {
	return "1.0.0"
}
