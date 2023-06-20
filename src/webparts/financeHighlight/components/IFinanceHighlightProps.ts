import { DisplayMode } from "@microsoft/sp-core-library"
import { WebPartContext } from "@microsoft/sp-webpart-base"
import {
  IFilePickerResult,
  IPropertyFieldSite,
} from "@pnp/spfx-property-controls"

export interface IFinanceHighlightProps {
  title: string
  displayMode: DisplayMode
  onTitleUpdate: (newTitle: string) => void
  sites: IPropertyFieldSite[]
  context: WebPartContext
  filePickerResult: IFilePickerResult
  websiteurl: string
  listID: string
  description: string
}
