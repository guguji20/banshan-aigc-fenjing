pub mod ai;
pub mod commands;

use std::path::PathBuf;

use commands::ai as ai_commands;
use commands::image;
use commands::project_state;
use tracing::{info, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

fn resolve_log_dir() -> Option<PathBuf> {
    let mut candidates = Vec::new();

    #[cfg(target_os = "macos")]
    if let Ok(home) = std::env::var("HOME") {
        candidates.push(PathBuf::from(home).join("Library/Logs/storyboard-copilot"));
    }

    candidates.push(std::env::temp_dir().join("storyboard-copilot/logs"));

    if let Ok(current_dir) = std::env::current_dir() {
        candidates.push(current_dir.join("logs"));
    }

    for directory in candidates {
        if std::fs::create_dir_all(&directory).is_ok() {
            return Some(directory);
        }
    }

    None
}

fn setup_logging() {
    let env_filter = tracing_subscriber::EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| "info,storyboard_copilot=debug".into());

    if let Some(log_dir) = resolve_log_dir() {
        let file_appender = tracing_appender::rolling::daily(log_dir, "storyboard.log");
        let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);
        std::mem::forget(_guard);

        tracing_subscriber::registry()
            .with(env_filter)
            .with(tracing_subscriber::fmt::layer().with_writer(non_blocking))
            .init();
    } else {
        tracing_subscriber::registry()
            .with(env_filter)
            .with(tracing_subscriber::fmt::layer())
            .init();
    }

    info!("Storyboard Copilot starting...");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    setup_logging();

    tauri::Builder::default()
        .setup(|app| {
            let window_config = app
                .config()
                .app
                .windows
                .iter()
                .find(|window| window.label == "main")
                .cloned()
                .ok_or_else(|| "missing main window config".to_string())?;

            #[cfg(not(target_os = "macos"))]
            {
                tauri::WebviewWindowBuilder::from_config(app, &window_config)?.build()?;
            }

            #[cfg(target_os = "macos")]
            {
                let mut mac_window_config = window_config;
                // Window effects radius only works for transparent windows on macOS.
                mac_window_config.transparent = true;

                let window = tauri::WebviewWindowBuilder::from_config(app, &mac_window_config)?.build()?;

                if let Err(err) = window.set_effects(Some(
                    tauri::window::EffectsBuilder::new()
                        .effect(tauri::window::Effect::Titlebar)
                        .radius(10.0)
                        .build(),
                )) {
                    warn!("failed to apply macOS window effects: {err}");
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            image::split_image,
            image::split_image_source,
            image::prepare_node_image_source,
            image::prepare_node_image_binary,
            image::crop_image_source,
            image::merge_storyboard_images,
            image::read_storyboard_image_metadata,
            image::embed_storyboard_image_metadata,
            image::load_image,
            image::persist_image_source,
            image::persist_image_binary,
            image::save_image_source_to_downloads,
            image::save_image_source_to_path,
            image::save_image_source_to_directory,
            image::save_image_source_to_app_debug_dir,
            image::copy_image_source_to_clipboard,
            ai_commands::set_api_key,
            ai_commands::generate_image,
            ai_commands::list_models,
            project_state::list_project_summaries,
            project_state::get_project_record,
            project_state::upsert_project_record,
            project_state::update_project_viewport_record,
            project_state::rename_project_record,
            project_state::delete_project_record,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
