/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { BlockInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';

export const OrchiskyBulkSelectedActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const schema = {
    type: 'void',
    title: '{{t("Bulk selected", { ns: "@orchisky/plugin-table-enhance" })}}',
    'x-component': 'Action',
    'x-use-component-props': 'useOrchiskyBulkSelectedActionProps',
    'x-align': 'right',
    'x-acl-action': 'update',
    'x-decorator': 'ACLActionProvider',
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    'x-action': 'customize:orchisky:bulk:selected',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:orchisky:bulk:selected',
    'x-action-settings': {
      assignedValues: {},
      updateMode: 'selected',
      customParams: {
        params: '{type:1}',
      },
      onSuccess: {
        manualClose: true,
        redirecting: false,
        successMessage: '{{t("Selected successfully", { ns: "@orchisky/plugin-table-enhance" })}}',
      },
    },
    'x-component-props': {
      icon: 'EditOutlined',
    },
  };
  return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />;
};
