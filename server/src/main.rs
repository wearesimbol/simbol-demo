extern crate simbol_server;

use std::thread;
use simbol_server::server::*;
use simbol_server::multivp::*;

fn main() {
    let mut routes: Vec<Route> = Vec::new();
    routes.push(Route {
        mount_path: String::from("/build/"),
        relative_path: String::from("build"),
    });
    routes.push(Route {
        mount_path: String::from("/assets/"),
        relative_path: String::from("assets"),
    });
    let server = SimbolServer::new(String::from("0.0.0.0"), 3000, String::from("client/"), routes);
    let http_handle = thread::spawn(move || {
        server.run_server();
    });

    let multivp_server = MultiVP::new(String::from("0.0.0.0"), 8000);
    let ws_handle = thread::spawn(move || {
        multivp_server.run_server();
    });

    http_handle.join().unwrap();
    ws_handle.join().unwrap();
}