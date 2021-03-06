/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const TAllowedMimeType = t.union(t.lit('application/pdf'), t.lit('application/xml'), t.lit('text/xml'), t.lit('image/jpeg'), t.lit('image/jpg'), t.lit('image/png'), t.lit('image/tiff'));

export const IFabricaiAttachment = t.iface([], {
  "id": "string",
  "base64": "string",
  "mimeType": "TAllowedMimeType",
});

const exportedTypeSuite: t.ITypeSuite = {
  TAllowedMimeType,
  IFabricaiAttachment,
};
export default exportedTypeSuite;
