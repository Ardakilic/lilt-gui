// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::{Child, Command as StdCommand, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Default)]
struct ProcessState {
    child: Mutex<Option<Child>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    lilt_path: String,
    sox_path: String,
    ffmpeg_path: String,
    ffprobe_path: String,
    use_docker: bool,
    enforce_output_format: String,
    no_preserve_metadata: bool,
    copy_images: bool,
    source_dir: String,
    target_dir: String,
}

/// Find binary in system PATH
#[tauri::command]
fn find_binary_in_path(binary_name: String) -> Result<String, String> {
    which::which(&binary_name)
        .map(|path| path.to_string_lossy().to_string())
        .map_err(|_| format!("{} not found in PATH", binary_name))
}

/// Select a file using the system file dialog
#[tauri::command]
async fn select_file(app: AppHandle, title: String) -> Result<String, String> {
    use tauri_plugin_dialog::DialogExt;
    
    let file_path = app
        .dialog()
        .file()
        .set_title(&title)
        .blocking_pick_file();
    
    match file_path {
        Some(path) => Ok(path.as_path().to_string_lossy().to_string()),
        None => Err("No file selected".to_string()),
    }
}

/// Select a directory using the system file dialog
#[tauri::command]
async fn select_directory(app: AppHandle, title: String) -> Result<String, String> {
    use tauri_plugin_dialog::DialogExt;
    
    let dir_path = app
        .dialog()
        .file()
        .set_title(&title)
        .blocking_pick_folder();
    
    match dir_path {
        Some(path) => Ok(path.as_path().to_string_lossy().to_string()),
        None => Err("No directory selected".to_string()),
    }
}

/// Start the lilt transcoding process
#[tauri::command]
async fn start_transcoding(
    app: AppHandle,
    state: State<'_, ProcessState>,
    settings: Settings,
) -> Result<(), String> {
    // Kill any existing process
    let mut child_lock = state.child.lock().unwrap();
    if let Some(mut child) = child_lock.take() {
        let _ = child.kill();
    }
    drop(child_lock);

    // Build command
    let mut cmd = StdCommand::new(&settings.lilt_path);
    
    // Add source directory
    cmd.arg(&settings.source_dir);
    
    // Add options
    cmd.arg("--target-dir").arg(&settings.target_dir);
    
    if settings.use_docker {
        cmd.arg("--use-docker");
    }
    
    if !settings.enforce_output_format.is_empty() {
        cmd.arg("--enforce-output-format").arg(&settings.enforce_output_format);
    }
    
    if settings.no_preserve_metadata {
        cmd.arg("--no-preserve-metadata");
    }
    
    if settings.copy_images {
        cmd.arg("--copy-images");
    }
    
    // Set environment variables for external binaries if not using docker
    if !settings.use_docker {
        if !settings.sox_path.is_empty() {
            let sox_dir = PathBuf::from(&settings.sox_path)
                .parent()
                .map(|p| p.to_string_lossy().to_string())
                .unwrap_or_default();
            if !sox_dir.is_empty() {
                let path_var = std::env::var("PATH").unwrap_or_default();
                cmd.env("PATH", format!("{}:{}", sox_dir, path_var));
            }
        }
    }
    
    // Configure for output capture
    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());
    
    // Spawn process
    let child = cmd.spawn().map_err(|e| format!("Failed to start lilt: {}", e))?;
    
    // Store the child process
    let mut child_lock = state.child.lock().unwrap();
    *child_lock = Some(child);
    
    // Emit event that process started
    let _ = app.emit("transcoding-started", ());
    
    Ok(())
}

/// Stop the transcoding process
#[tauri::command]
async fn stop_transcoding(
    app: AppHandle,
    state: State<'_, ProcessState>,
) -> Result<(), String> {
    let mut child_lock = state.child.lock().unwrap();
    
    if let Some(mut child) = child_lock.take() {
        child.kill().map_err(|e| format!("Failed to kill process: {}", e))?;
        let _ = app.emit("transcoding-stopped", ());
        Ok(())
    } else {
        Err("No process running".to_string())
    }
}

/// Check if transcoding process is running
#[tauri::command]
fn is_transcoding_running(state: State<'_, ProcessState>) -> bool {
    let child_lock = state.child.lock().unwrap();
    child_lock.is_some()
}

/// Save settings to local storage (handled by frontend, this is a placeholder)
#[tauri::command]
fn save_settings(settings: Settings) -> Result<(), String> {
    // Settings are saved in localStorage by the frontend
    // This command could be extended to save to a file if needed
    println!("Settings saved: {:?}", settings);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .manage(ProcessState::default())
        .invoke_handler(tauri::generate_handler![
            find_binary_in_path,
            select_file,
            select_directory,
            start_transcoding,
            stop_transcoding,
            is_transcoding_running,
            save_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
