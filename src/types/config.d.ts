export interface Config {
    hosts: {
        production: HostConfig,
        development: HostConfig
    };
    domain: string;
    dev: boolean;
    socketio: boolean;
}

export interface HostConfig {
    httpPort: number;
    httpsPort: number;
    database?: DatabaseConfig;
}

export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}