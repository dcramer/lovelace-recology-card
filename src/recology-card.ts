import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import { HomeAssistant, hasConfigOrEntityChanged, LovelaceCardEditor } from 'custom-card-helpers';

import './editor';

import { RecologyCardConfig } from './types';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  RECOLOGY-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

@customElement('recology-card')
export class RecologyCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('recology-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  @property() public hass?: HomeAssistant;
  @property() private _config?: RecologyCardConfig;

  public setConfig(config: RecologyCardConfig): void {
    if (!config || !config.entity) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this._config = {
      name: 'Garbage Collection',
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected getFlagName(flag): string {
    switch (flag) {
      case 'organics':
        return 'Compost';
      case 'recycling':
        return 'Recycling';
      case 'garbage':
        return 'Garbage';
    }
    return flag;
  }

  protected getIcon(flag): string {
    switch (flag) {
      case 'organics':
        return 'mdi:food';
      case 'recycling':
        return 'mdi:recycle';
      case 'garbage':
        return 'mdi:trash-can';
    }
    return '';
  }

  protected daysUntil(target: string): number {
    const now = new Date();
    const then = new Date(target);
    const timeDelta = Math.abs(then.getTime() - now.getTime());
    let days = Math.ceil(timeDelta / (1000 * 3600 * 24));
    if (then.getTime() < now.getTime()) {
      days = -days;
    }
    return days;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass && this.hass.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-error-entity-row .entity="${this._config.entity}"></hui-error-entity-row>
      `;
    }

    const { next_date, flags } = stateObj.attributes;
    const daysUntil = this.daysUntil(next_date);

    return html`
      <ha-card .header=${this._config.name} tabindex="0" aria-label="${this._config.name}">
        <div id="states" class="card-content">
          ${flags.map(flag => {
            return html`
              <div class="flex">
                <div class="badge">
                  <ha-icon icon="${this.getIcon(flag) || 'mdi:train-car'}"></ha-icon>
                </div>
                <div class="info padName">
                  ${this.getFlagName(flag)}
                </div>
                <div class="date">${daysUntil} day${daysUntil != 1 ? 's' : ''}</div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  getCardSize(): number {
    if (!this._config || !this._config.entity) return 1;
    return 3;
  }

  static get styles(): CSSResult {
    return css`
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 0px;
        flex: 1 1 0%;
      }
      .info {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex: 1 0 60px;
        margin-left: 12px;
      }
      .date {
        margin-left: 12px;
        text-align: right;
      }
      .padName {
        padding: 12px 0px;
      }
    `;
  }
}
