/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { setup as pnpSetup } from '@pnp/common';
import * as strings from 'FinanceHighlightWebPartStrings';
import FinanceHighlight from './components/FinanceHighlight';
import { IFilePickerResult, IPropertyFieldSite, PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls';

export interface IFinanceHighlightWebPartProps {
  title: string;
  sites: IPropertyFieldSite[];
  filePickerResult: IFilePickerResult;
  listID: string;
  description: string;
}

export default class FinanceHighlightWebPart extends BaseClientSideWebPart<IFinanceHighlightWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFinanceHighlightWebPartProps> = React.createElement(
      FinanceHighlight,
      {
        title: this.properties.title,
        description: this.properties.description,
        sites: this.properties.sites,
        // mengambil url dari list
        websiteurl: this.context.pageContext.web.absoluteUrl,
        listID: this.properties.listID,
        context: this.context,
        displayMode: this.displayMode,
        onTitleUpdate: (newTitle: string) => {
            // after updating the web part title in the component
            // persist it in web part properties yes
            this.properties.title = newTitle;
        },
        filePickerResult: this.properties.filePickerResult
    });
    console.log("Render Elementnya : ",element)
    ReactDom.render(element, this.domElement);
}

  protected async onInit(): Promise<void> {
    pnpSetup({
      spfxContext: this.context
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneTextField('title', {label: this.properties.title}),
                PropertyFieldListPicker('listID', {
                  label: 'Select a List',
                  selectedList: this.properties.listID,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context as any,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  baseTemplate: 0
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
