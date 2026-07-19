// package: christiangeorgelucas.phone_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class ParseInput extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getDefaultCountry(): string;
  setDefaultCountry(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseInput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseInput): ParseInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseInput;
  static deserializeBinaryFromReader(message: ParseInput, reader: jspb.BinaryReader): ParseInput;
}

export namespace ParseInput {
  export type AsObject = {
    text: string,
    defaultCountry: string,
  }
}

export class PhoneNumber extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  getPossible(): boolean;
  setPossible(value: boolean): void;

  getE164(): string;
  setE164(value: string): void;

  getNational(): string;
  setNational(value: string): void;

  getInternational(): string;
  setInternational(value: string): void;

  getRfc3966(): string;
  setRfc3966(value: string): void;

  getCountry(): string;
  setCountry(value: string): void;

  getCountryCallingCode(): string;
  setCountryCallingCode(value: string): void;

  getType(): string;
  setType(value: string): void;

  getExt(): string;
  setExt(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PhoneNumber.AsObject;
  static toObject(includeInstance: boolean, msg: PhoneNumber): PhoneNumber.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PhoneNumber, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PhoneNumber;
  static deserializeBinaryFromReader(message: PhoneNumber, reader: jspb.BinaryReader): PhoneNumber;
}

export namespace PhoneNumber {
  export type AsObject = {
    valid: boolean,
    possible: boolean,
    e164: string,
    national: string,
    international: string,
    rfc3966: string,
    country: string,
    countryCallingCode: string,
    type: string,
    ext: string,
    error: string,
  }
}

export class ValidateInput extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getDefaultCountry(): string;
  setDefaultCountry(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateInput.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateInput): ValidateInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateInput;
  static deserializeBinaryFromReader(message: ValidateInput, reader: jspb.BinaryReader): ValidateInput;
}

export namespace ValidateInput {
  export type AsObject = {
    text: string,
    defaultCountry: string,
  }
}

export class Validation extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  getPossible(): boolean;
  setPossible(value: boolean): void;

  getCountry(): string;
  setCountry(value: string): void;

  getType(): string;
  setType(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Validation.AsObject;
  static toObject(includeInstance: boolean, msg: Validation): Validation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Validation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Validation;
  static deserializeBinaryFromReader(message: Validation, reader: jspb.BinaryReader): Validation;
}

export namespace Validation {
  export type AsObject = {
    valid: boolean,
    possible: boolean,
    country: string,
    type: string,
    reason: string,
  }
}

export class FormatInput extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getDefaultCountry(): string;
  setDefaultCountry(value: string): void;

  getFormat(): string;
  setFormat(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FormatInput.AsObject;
  static toObject(includeInstance: boolean, msg: FormatInput): FormatInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FormatInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FormatInput;
  static deserializeBinaryFromReader(message: FormatInput, reader: jspb.BinaryReader): FormatInput;
}

export namespace FormatInput {
  export type AsObject = {
    text: string,
    defaultCountry: string,
    format: string,
  }
}

export class Formatted extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getFormat(): string;
  setFormat(value: string): void;

  getValid(): boolean;
  setValid(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Formatted.AsObject;
  static toObject(includeInstance: boolean, msg: Formatted): Formatted.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Formatted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Formatted;
  static deserializeBinaryFromReader(message: Formatted, reader: jspb.BinaryReader): Formatted;
}

export namespace Formatted {
  export type AsObject = {
    text: string,
    format: string,
    valid: boolean,
    error: string,
  }
}

export class ExtractInput extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getDefaultCountry(): string;
  setDefaultCountry(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractInput): ExtractInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractInput;
  static deserializeBinaryFromReader(message: ExtractInput, reader: jspb.BinaryReader): ExtractInput;
}

export namespace ExtractInput {
  export type AsObject = {
    text: string,
    defaultCountry: string,
  }
}

export class Extracted extends jspb.Message {
  clearNumbersList(): void;
  getNumbersList(): Array<PhoneNumber>;
  setNumbersList(value: Array<PhoneNumber>): void;
  addNumbers(value?: PhoneNumber, index?: number): PhoneNumber;

  getCount(): number;
  setCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Extracted.AsObject;
  static toObject(includeInstance: boolean, msg: Extracted): Extracted.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Extracted, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Extracted;
  static deserializeBinaryFromReader(message: Extracted, reader: jspb.BinaryReader): Extracted;
}

export namespace Extracted {
  export type AsObject = {
    numbersList: Array<PhoneNumber.AsObject>,
    count: number,
    error: string,
  }
}

export class CountryInfoInput extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountryInfoInput.AsObject;
  static toObject(includeInstance: boolean, msg: CountryInfoInput): CountryInfoInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountryInfoInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountryInfoInput;
  static deserializeBinaryFromReader(message: CountryInfoInput, reader: jspb.BinaryReader): CountryInfoInput;
}

export namespace CountryInfoInput {
  export type AsObject = {
    country: string,
  }
}

export class CountryInfo extends jspb.Message {
  getCountry(): string;
  setCountry(value: string): void;

  getCallingCode(): string;
  setCallingCode(value: string): void;

  getExampleMobileE164(): string;
  setExampleMobileE164(value: string): void;

  getKnown(): boolean;
  setKnown(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountryInfo.AsObject;
  static toObject(includeInstance: boolean, msg: CountryInfo): CountryInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CountryInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountryInfo;
  static deserializeBinaryFromReader(message: CountryInfo, reader: jspb.BinaryReader): CountryInfo;
}

export namespace CountryInfo {
  export type AsObject = {
    country: string,
    callingCode: string,
    exampleMobileE164: string,
    known: boolean,
    error: string,
  }
}

