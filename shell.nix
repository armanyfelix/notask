{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    # Herramientas de compilación
    gcc
    pkg-config
    openssl
    
    # Dependencias para Tauri
    webkitgtk_4_1
    glib
    gtk3
    # libsoup_2_4
    librsvg
    
    # Herramientas de desarrollo
    nodejs_24
    bun
    rustc
    cargo
  ];
  
  # Variables de entorno necesarias
  LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [
    webkitgtk_4_1
    glib
    gtk3
    # libsoup_2_4
    librsvg
  ];
  
  # Añade esta variable para los esquemas GSettings
  GSETTINGS_SCHEMA_DIR = "${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}/glib-2.0/schemas";  

}