// Prevents additional console window on Windows in release, DO NOT REMOVE!!
<<<<<<< HEAD
#![allow(unused)]
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub use error::{Error, Result};
// use model::Store;
use std::sync::Arc;

mod error;
// mod model;

=======
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

>>>>>>> 0ea51447c881a05a778630ad72ed766e4bbbc3e7
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

<<<<<<< HEAD
#[tokio::main]
async fn main() -> Result<()> {
    // let store = Store::new().await?;
    // let store = Arc::new(store);

    tauri::Builder::default()
        // .manage(store)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
=======
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
>>>>>>> 0ea51447c881a05a778630ad72ed766e4bbbc3e7
}
