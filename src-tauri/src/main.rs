// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::{State, Window};
use serde::{Deserialize, Serialize};
use anyhow::Result;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[derive(Debug, Serialize, Deserialize)]
pub struct LiltConfig {
    pub lilt_path: String,
    pub sox_path: String,
    pub sox_ng_path: String,
    pub ffmpeg_path: String,
    pub ffprobe_path: String,
    pub use_docker: bool,
    pub docker_image: String,
    pub source_dir: String,
    pub target_dir: String,
    pub copy_images: bool,
    pub no_preserve_metadata: bool,
    pub enforce_output_format: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessOutput {
    pub line: String,
    pub is_error: bool,
}

// Global state to track running processes
type ProcessMap = Mutex<HashMap<String, Child>>;

#[tauri::command]
async fn find_binary_in_path(binary_name: String) -> Result<String, String> {
    let output = if cfg!(target_os = "windows") {
        Command::new("where")
            .arg(&binary_name)
            .output()
    } else {
        Command::new("which")
            .arg(&binary_name)
            .output()
    };

    match output {
        Ok(output) => {
            if output.status.success() {
                let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if !path.is_empty() {
                    Ok(path.lines().next().unwrap_or("").to_string())
                } else {
                    Err(format!("{} not found in PATH", binary_name))
                }
            } else {
                Err(format!("{} not found in PATH", binary_name))
            }
        }
        Err(e) => Err(format!("Error searching for {}: {}", binary_name, e)),
    }
}

#[tauri::command]
async fn start_lilt_process(
    config: LiltConfig,
    window: Window,
    processes: State<'_, ProcessMap>,
) -> Result<String, String> {
    let process_id = "lilt_main".to_string();
    
    // Kill any existing process
    {
        let mut processes_guard = processes.lock().unwrap();
        if let Some(mut child) = processes_guard.remove(&process_id) {
            let _ = child.kill();
        }
    }

    // Build command arguments
    let mut args = vec![config.source_dir];
    
    if !config.target_dir.is_empty() {
        args.push("--target-dir".to_string());
        args.push(config.target_dir);
    }
    
    if config.copy_images {
        args.push("--copy-images".to_string());
    }
    
    if config.no_preserve_metadata {
        args.push("--no-preserve-metadata".to_string());
    }
    
    if !config.enforce_output_format.is_empty() {
        args.push("--enforce-output-format".to_string());
        args.push(config.enforce_output_format);
    }
    
    if config.use_docker {
        args.push("--use-docker".to_string());
        if !config.docker_image.is_empty() && config.docker_image != "ardakilic/sox_ng:latest" {
            args.push("--docker-image".to_string());
            args.push(config.docker_image);
        }
    }

    // Start the process
    let mut command = Command::new(&config.lilt_path);
    command
        .args(&args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    match command.spawn() {
        Ok(mut child) => {
            let window_clone = window.clone();
            let process_id_clone = process_id.clone();
            
            // Store the process
            {
                let mut processes_guard = processes.lock().unwrap();
                processes_guard.insert(process_id.clone(), child);
            }
            
            // Handle stdout in a separate task
            if let Some(stdout) = child.stdout.take() {
                tokio::spawn(async move {
                    use std::io::{BufRead, BufReader};
                    let reader = BufReader::new(stdout);
                    for line in reader.lines() {
                        if let Ok(line) = line {
                            let output = ProcessOutput {
                                line,
                                is_error: false,
                            };
                            let _ = window_clone.emit("lilt-output", &output);
                        }
                    }
                });
            }
            
            // Handle stderr in a separate task
            if let Some(stderr) = child.stderr.take() {
                tokio::spawn(async move {
                    use std::io::{BufRead, BufReader};
                    let reader = BufReader::new(stderr);
                    for line in reader.lines() {
                        if let Ok(line) = line {
                            let output = ProcessOutput {
                                line,
                                is_error: true,
                            };
                            let _ = window.emit("lilt-output", &output);
                        }
                    }
                });
            }
            
            Ok(process_id)
        }
        Err(e) => Err(format!("Failed to start lilt process: {}", e)),
    }
}

#[tauri::command]
async fn stop_lilt_process(
    processes: State<'_, ProcessMap>,
) -> Result<String, String> {
    let process_id = "lilt_main".to_string();
    
    let mut processes_guard = processes.lock().unwrap();
    if let Some(mut child) = processes_guard.remove(&process_id) {
        match child.kill() {
            Ok(_) => Ok("Process stopped successfully".to_string()),
            Err(e) => Err(format!("Failed to stop process: {}", e)),
        }
    } else {
        Err("No running process found".to_string())
    }
}

#[tauri::command]
async fn check_lilt_version(lilt_path: String) -> Result<String, String> {
    let output = Command::new(&lilt_path)
        .arg("--version")
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                Ok(version)
            } else {
                Err("Failed to get version".to_string())
            }
        }
        Err(e) => Err(format!("Error getting version: {}", e)),
    }
}

#[tauri::command]
async fn open_lilt_releases() -> Result<(), String> {
    let url = "https://github.com/Ardakilic/lilt/releases/latest";
    
    if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/c", "start", url])
            .spawn()
            .map_err(|e| format!("Failed to open URL: {}", e))?;
    } else if cfg!(target_os = "macos") {
        Command::new("open")
            .arg(url)
            .spawn()
            .map_err(|e| format!("Failed to open URL: {}", e))?;
    } else {
        Command::new("xdg-open")
            .arg(url)
            .spawn()
            .map_err(|e| format!("Failed to open URL: {}", e))?;
    }
    
    Ok(())
}

fn main() {
    env_logger::init();
    
    tauri::Builder::default()
        .manage(ProcessMap::default())
        .invoke_handler(tauri::generate_handler![
            find_binary_in_path,
            start_lilt_process,
            stop_lilt_process,
            check_lilt_version,
            open_lilt_releases
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}