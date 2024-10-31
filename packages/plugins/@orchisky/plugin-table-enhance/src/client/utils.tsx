/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { SchemaExpressionScopeContext, useField, useFieldSchema } from '@formily/react';

import {
  TableFieldResource,
  isVariable,
  transformVariableValue,
  useBlockRequestContext,
  useCollection_deprecated,
  useCompile,
  useLocalVariables,
  useNavigateNoUpdate,
  useTableBlockContext,
  useVariables,
  useDataBlockRequest,
  useDataBlockResource,
  useApp,
} from '@nocobase/client';
import { isURL } from '@nocobase/utils/client';
import { App, message } from 'antd';
import { useContext } from 'react';
import { useT } from './locale';

export const useOrchiskyBulkSelectedActionProps = () => {
  const { field, resource, __parent, service } = useBlockRequestContext();
  const dbRequest = useDataBlockRequest();
  const dbResource = useDataBlockResource();
  const expressionScope = useContext(SchemaExpressionScopeContext);
  const actionSchema = useFieldSchema();
  const tableBlockContext = useTableBlockContext();
  const { rowKey } = tableBlockContext;
  console.log('rowKey: ', rowKey);
  const t = useT();
  const navigate = useNavigateNoUpdate();
  const compile = useCompile();
  const actionField: any = useField();
  const { modal } = App.useApp();
  const variables = useVariables();
  const { name, getField } = useCollection_deprecated();
  const localVariables = useLocalVariables();
  return {
    async onClick(e, callBack) {
      const { onSuccess, customParams } = actionSchema?.['x-action-settings'] ?? {};
      actionField.data = field.data || {};
      actionField.data.loading = true;
      const selectedRecordKeys =
        tableBlockContext.field?.data?.selectedRowKeys ?? expressionScope?.selectedRecordKeys ?? {};

      modal.confirm({
        title: t('Confirm selected'),
        content: t('Confirm selected data?'),
        async onOk() {
          const updateData: { values: any } = {
            values: {
              ...customParams,
              ids: selectedRecordKeys,
            },
          };
          if (!selectedRecordKeys?.length) {
            message.error(t('Please select the records'));
            actionField.data.loading = false;
            return;
          }
          try {
            await resource.orchisky_selected(updateData);
          } catch (error) {
            /* empty */
          } finally {
            actionField.data.loading = false;
          }
          if (callBack) {
            callBack?.();
          }
          // service?.refresh?.();
          if (!(resource instanceof TableFieldResource)) {
            __parent?.service?.refresh?.();
          }
          if (!onSuccess?.successMessage) {
            return;
          }
          if (onSuccess?.manualClose) {
            modal.success({
              title: compile(onSuccess?.successMessage),
              onOk: async () => {
                if (onSuccess?.redirecting && onSuccess?.redirectTo) {
                  if (isURL(onSuccess.redirectTo)) {
                    window.location.href = onSuccess.redirectTo;
                  } else {
                    navigate(onSuccess.redirectTo);
                  }
                }
              },
            });
          } else {
            message.success(compile(onSuccess?.successMessage));
            if (onSuccess?.redirecting && onSuccess?.redirectTo) {
              if (isURL(onSuccess.redirectTo)) {
                window.location.href = onSuccess.redirectTo;
              } else {
                navigate(onSuccess.redirectTo);
              }
            }
          }
        },
        async onCancel() {
          actionField.data.loading = false;
        },
      });
    },
  };
};
