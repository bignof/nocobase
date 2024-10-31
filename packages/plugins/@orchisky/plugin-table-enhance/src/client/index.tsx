/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin, useActionAvailable } from '@nocobase/client';
import orchiskyBulkSelectedActionSettings from './OrchiskyBulkSelectedAction.Setting';
import { useOrchiskyBulkSelectedActionProps } from './utils';
import { OrchiskyBulkSelectedActionInitializer } from './OrchiskyBulkSelectedActionInitializer';

export class PluginTableEnhanceClient extends Plugin {
  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.app.addScopes({ useOrchiskyBulkSelectedActionProps });
    this.app.schemaSettingsManager.add(orchiskyBulkSelectedActionSettings);
    const initializerData = {
      title: '{{t("Bulk selected", { ns: "@orchisky/plugin-table-enhance" })}}',
      Component: OrchiskyBulkSelectedActionInitializer,
      name: 'orchiskyBulkSelected',
      useVisible: () => useActionAvailable('updateMany'),
    };

    this.app.schemaInitializerManager.addItem('table:configureActions', 'orchisky.bulk.selected', initializerData);
    this.app.schemaInitializerManager.addItem('gantt:configureActions', 'orchisky.bulk.selected', initializerData);
    this.app.schemaInitializerManager.addItem('map:configureActions', 'orchisky.bulk.selected', initializerData);
  }
}

export default PluginTableEnhanceClient;
