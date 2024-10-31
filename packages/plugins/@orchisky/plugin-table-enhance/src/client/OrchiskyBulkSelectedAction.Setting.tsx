/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import {
  ActionDesigner,
  RefreshDataBlockRequest,
  SchemaSettings,
  SchemaSettingsItemType,
  SchemaSettingsModalItem,
  useDesignable,
  useSchemaToolbar,
} from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { ISchema, useFieldSchema } from '@formily/react';
import React from 'react';
import { isValid } from '@formily/shared';
import { useT } from './locale';

function CustomParams() {
  const t = useT();

  const { dn } = useDesignable();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsModalItem
      title={t('custom params')}
      initialValues={fieldSchema?.['x-action-settings']?.['customParams']}
      schema={
        {
          type: 'object',
          properties: {
            params: {
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={(onSuccess) => {
        fieldSchema['x-action-settings']['customParams'] = onSuccess;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
      }}
    />
  );
}

function AfterSuccess() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsModalItem
      title={t('After successful submission')}
      initialValues={fieldSchema?.['x-action-settings']?.['onSuccess']}
      schema={
        {
          type: 'object',
          title: t('After successful submission'),
          properties: {
            successMessage: {
              title: t('Popup message'),
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {},
            },
            manualClose: {
              title: t('Popup close method'),
              enum: [
                { label: t('Automatic close'), value: false },
                { label: t('Manually close'), value: true },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              'x-component-props': {},
            },
            redirecting: {
              title: t('Then'),
              enum: [
                { label: t('Stay on current page'), value: false },
                { label: t('Redirect to'), value: true },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              'x-component-props': {},
              'x-reactions': {
                target: 'redirectTo',
                fulfill: {
                  state: {
                    visible: '{{!!$self.value}}',
                  },
                },
              },
            },
            redirectTo: {
              title: t('Link'),
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={(onSuccess) => {
        fieldSchema['x-action-settings']['onSuccess'] = onSuccess;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
      }}
    />
  );
}

const schemaSettingsItem: SchemaSettingsItemType[] = [
  {
    name: 'editButton',
    Component: ActionDesigner.ButtonEditor,
    useComponentProps() {
      const { buttonEditorProps } = useSchemaToolbar();
      return buttonEditorProps;
    },
  },
  {
    name: 'afterSuccess',
    Component: AfterSuccess,
    useVisible() {
      const fieldSchema = useFieldSchema();
      return isValid(fieldSchema?.['x-action-settings']?.onSuccess);
    },
  },
  {
    name: 'customParams',
    Component: CustomParams,
    useVisible() {
      const fieldSchema = useFieldSchema();
      return isValid(fieldSchema?.['x-action-settings']?.customParams);
    },
  },
  {
    name: 'refreshDataBlockRequest',
    Component: RefreshDataBlockRequest,
    useComponentProps() {
      return {
        isPopupAction: false,
      };
    },
  },
  {
    name: 'remove',
    sort: 100,
    Component: ActionDesigner.RemoveButton as any,
    useComponentProps() {
      const { removeButtonProps } = useSchemaToolbar();
      return removeButtonProps;
    },
  },
];

const orchiskyBulkSelectedActionSettings = new SchemaSettings({
  name: 'actionSettings:orchisky:bulk:selected',
  items: schemaSettingsItem,
});

export default orchiskyBulkSelectedActionSettings;
