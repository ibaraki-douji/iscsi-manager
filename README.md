# ISCSI Manager

## Description

This is a simple ISCSI manager that allows discovery, login, logout and list of ISCSI targets.

You can find the latest release [here](https://git.ibaraki.app/apps/iscsi-manager/-/releases), it includes a DEB package and AppImage. 

## Features

- Discover ISCSI targets
- Login to ISCSI targets
- Logout from ISCSI targets
- List ISCSI targets
- Remove ISCSI targets
- View ISCSI volumes, partitions and filesystems

## Development

### Prerequisites

- NodeJS
- NPM

You also need some APT packages:

- open-iscsi
- util-linux (should be installed by default)

### Installation

```bash
npm install
```

### Running

#### Running as DEV

```bash
npm start
```

#### Running as PROD

```bash
npm run start:packed
```

### Building

#### Building Angular

```bash
npm run ng:build
```

#### Building Electron

```bash
npm run electron:build
```

#### Building all

```bash
npm run pack
```

## TODO

- [ ] Add CHAP support
```bash
iscsiadm  --mode node --targetname "<iqn>"  --portal <ip:port> --op=update --name node.session.auth.authmethod --value=CHAP
iscsiadm  --mode node --targetname "<iqn>"  --portal <ip:port> --op=update --name node.session.auth.username --value="<user>"
iscsiadm  --mode node --targetname "<iqn>" --portal <ip:port> --op=update --name node.session.auth.password --value="<password>"
```
- [ ] Add startup button
```conf
# /etc/iscsi/iscsid.conf
node.startup = true
```