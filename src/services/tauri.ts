import { invoke } from "@tauri-apps/api/core";

export async function findBinaryInPath(binaryName: string): Promise<string> {
  return await invoke<string>("find_binary_in_path", { binaryName });
}

export async function selectFile(title: string): Promise<string> {
  return await invoke<string>("select_file", { title });
}

export async function selectDirectory(title: string): Promise<string> {
  return await invoke<string>("select_directory", { title });
}

export async function startTranscoding(settings: unknown): Promise<void> {
  return await invoke<void>("start_transcoding", { settings });
}

export async function stopTranscoding(): Promise<void> {
  return await invoke<void>("stop_transcoding");
}

export async function isTranscodingRunning(): Promise<boolean> {
  return await invoke<boolean>("is_transcoding_running");
}
