# Recology Card

TODO: Currently requires a custom sensor which I'll eventually build into a component.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

## Options

| Name   | Type     | Requirement  | Description            | Default              |
| ------ | -------- | ------------ | ---------------------- | -------------------- |
| type   | string   | **Required** | `custom:recology-card` |
| name   | string   | **Optional** | Card name              | `Garbage Collection` |
| entity | string[] | **Optional** | Recology entity        | `none`               |

## Developing with [devcontainer][devcontainer]

1. Fork and clone the repository.
2. Open the [devcontainer][devcontainer] and run `npm start` when it's ready.
3. The compiled `.js` file will be accessible on
   `http://127.0.0.1:5000/recology-card.js`.
4. On a running Home Assistant installation add this to your Lovelace
   `resources:`

```yaml
- url: 'http://127.0.0.1:5000/recology-card.js'
  type: module
```

_Change "127.0.0.1" to the IP of your development machine._

### Bonus

If you need a fresh test instance you can install a fresh Home Assistant instance inside the devcontainer as well.

1. Run the command `dc start`.
2. Home Assistant will install and will eventually be running on port `9123`
