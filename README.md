<br />
<p align="center">
  <a href="/">
    <img src="https://fabricai.fi/wp-content/uploads/2019/09/FabricAI-Banner-Logo.png" alt="FabricAI Oy" width="730" height="150">
  </a>

  <h3 align="center">AI Inside by FabricAI</h3>

  <p align="center">
    AI Inside by FabricAI provides a mass customizable <b>state-of-the-art</b> Artificial Intelligence for purchase invoice processes.
    <br />
    <a href="https://fabricai.fi"><strong>FabricAI»</strong></a>
    <br />
    <br />
    <a href="https://github.com/fabricai/ai-inside/tree/master/src/interfaces">Interfaces</a>
    ·
    <a href="https://github.com/fabricai/ai-inside/tree/master/src/validations">Validations</a>
    ·
    <a href="https://github.com/fabricai/ai-inside/tree/master/src/sampleFlow">Sample Flow</a>
    ·
    <a href="https://fabricai.fi/company/">Contact us</a>
  </p>
</p>

<!-- ABOUT -->

## About

AI Inside by FabricAI offers developers a quick and easy way to integrate FabricAI's **state-of-the-art** AI in their own purchase invoice automation workflows as a microservice via simple REST API.

You can use the AI Inside by FabricAI e.g. to:

-   predict `accounts` (e.g. this invoiceRow belongs to account "4000 :: Purchases"),
-   predict `VAT statuses` (e.g. this invoice has "EU Product")
-   predict `approval lists` (e.g. this invoice should be sent to "John Matrix" for approval)
-   predict `cost center` (e.g. this invoiceRow belongs to "Marketing")

for new invoices. Then you can integrate this information in your own software to speed up the process of handling purchase invoices.

## Overview of the process

Using the AI Inside by FabricAI should be a continuous process, where you constantly update your dataset with latest data and periodically retrain the model(s).

The basic flow to use AI Inside by FabricAI are (this is demonstrated in /src/sampleFlow):

1. Ask us to setup an organization and integration(s) for you
2. POST basic info about the integration
3. POST all historic training data (invoices with appropriate labels) that will be used to train model(s) from the last two to three years
4. Request model training for the appropriate label(s) by contacting us
5. POST new invoices that you want to get predictions for
6. Keep POST'ing finalized invoices to the `/ai/training-data/invoices` endpoint as new training samples (e.g. once your accountant has posted invoice to the ledger)
7. Go to the step 4 and repeat until forever

Depending on the context of the integration and label(s), it is adviced to train a new model for DIMENSION every month or so, and for ACCOUNT every two to three months. However, in some instances increasing or decreasing this retraining frequency may be advisable.

## Getting started

### Prerequisites

To start using AI Inside by FabricAI you are going to have to ask us to create:

-   an `organization` and
-   an `employeeToken` for the organization

At the moment this is done manually for each customer (you) by FAI.

### Installation

All our public libraries are written in Node.js version 12

1. Clone this repo

```sh
git clone https://github.com/@fabricai/ai-inside.git
```

2. Install NPM packages

```sh
npm install @fabricai/ai-inside
```

### Endpoint

The REST API can be accessed at `https://api.fabricai.fi/v3/`

### Endpoint security

All endpoints are protected and require authentication with a [JWT](https://jwt.io/introduction/).

A valid JWT token must be present in every request's `Authorization` header in the format `Bearer {encoded JWT}`. All requests without a valid token will fail and return `403`.

### Authentication

Authentication endpoint is `/v3/token/session`

To authenticate, you need provide following data in the headers of your request:

-   employeeToken (required)
    -   this token is _attached_ to an user and by proxy to an organization
-   integrationKey (optional)
    -   this is used to select customerCompany whose data you want to get authorization for
    -   if no integrationKey is provided, only organization's data is returned
-   expiresAt (optional)
    -   javascript timestamp on when the generated JWT will expire
    -   default is one hour after creation

#### Example authentication

First get the organization's information by providing only your `employeeToken`

```sh
curl -X GET 'https://api.fabricai.fi/v3/token/session' -H 'EmployeeToken: {employeeToken}'
```

Then select an integration from path `data.organization.integrations` and pass this key in the header to generate JWT with the `employeeToken`. You may also decide to provide expiresAt timestamp to define a custom expiration for the JWT.

```sh
curl -X GET 'https://api.fabricai.fi/v3/token/session' -H 'EmployeeToken: {employeeToken}' -H 'IntegrationKey: {integrationKey}' -H 'ExpiresAt: {JS timestamp}'
```

This request should return following object that includes an encoded JWT token.

```typescript
enum EResponseStatus {
    OK = 'OK',
    FAIL = 'FAIL',
}
interface IResponseWrapper {
    status: EResponseStatus;
    retryable: boolean;
    retryDelayMs: number;
    message?: string;
    data?: any;
}

interface IResponseJWT extends IResponseWrapper {
    data: {
        // This is the JWT that must be passed in the Authorization: `Bearer {code}`
        code: string;
    };
}
```

Then you can get this integration's (ie. `integrationKey`s) info by

```sh
curl -X GET 'https://api.fabricai.fi/v3/integrations' -H 'Authorization: Bearer {encoded JWT}'
```

The request should return an object

```typescript
enum EModelLabel {
    ACCOUNT = 'ACCOUNT',
    DIMENSION = 'DIMENSION',
}
enum EModelGenerator {
    // Not available via AI Inside by FabricAI
    CHARMANDER = 'CHARMANDER',
    CHARMELEON = 'CHARMELEON',
    // Not available via AI Inside by FabricAI
    CHARIZARD = 'CHARIZARD',
    // Going to be released during Q1 or early Q2
    EEVEE = 'EEVEE',
}
interface IResponseIntegration extends IResponseWrapper {
    data: {
        integration: {
            businessId: string;
            name: string;
            fiscalPeriodTreshold?: number;
            mlModels?: {
                [modelKey]: {
                    dimensionId: string;
                    label: EModelLabel;
                    modelGenerator: EModelGenerator;
                    modelId: string;
                    preprocessor: string;
                    timestamp: number;
                    trainingId: string;
                };
            };
            system: 'api';
        };
    };
}
```

## Terms and definitions

<details>
 <summary>These terms and definitions are used throughout this documentation and AI Inside by FabricAI to describe certain things. (...click to expand)</summary>

### EmployeeToken

_Required_

Employee token is used to authenticate and authroize client against the enpoint.

Employee token is attached to a single user (by `uid`) and by proxy to that user's organization. The Employee token will have admin level access to the organization.

### Organization

_Required_

An organization is e.g. an accounting office, a software vendor, an individual developer, or an integration partner.

Organization in AI Inside by FabricAI has:

-   [0 ... n] accountants
-   [0 ... n] teams
-   [0 ... n] integrations

Organization is identified by an _organizationKey_.

### Integration

_Required_

Integration is a company whose invoices are being processed with AI Inside by FabricAI.

Integration is identified by an _integrationKey_ that can be fetched via the API. If you need more integrations, you are going to have to ask us to make more placeholders and assign them to your organization.

In AI Inside by FabricAI an integration has:

-   Basic information (/src/interfaces/sessioninfo.ts)
-   coa (/src/interfaces/coa.ts)
    -   chart of account, tilikartta
-   dimensions (/src/interfaces/dimensions.ts)
    -   cost centers, kustannuspaikat, dimensiot
-   fiscalyears (/src/interfaces/fisalyears)
    -   suljettu tilikausi
-   invoices (/src/interfaces/invoice/index.ts)

### Model

_Required_

A model in AI Inside by FabricAI is a mathematical algorithm that has been trained to predict given _label_. The model is always trained on the integration's data to predict integration's _labels_ for each invoiceRow.

Each integration must have at least one _custom_ model that is ACCOUNT. Ie. model that will be trained on integration's invoices to predict accounts.

In addition to model for ACCOUNT, each integration can have as many additional models as they want. These are grouped under _DIMENSION_ flag, but should be considered as more generic.

E.g. an integration can have model(s) live based on your specific needs for:

-   DIMENSION-approvalList
-   DIMENSION-project
-   DIMENSION-department

Each integration automatically uses a shared model to predict VAT_STATUS.

### Team

_Optional_

Team is a collection of accountant(s) and integration(s) that are shared between multiple team members. This way, you may e.g. divide your accountants and integrations into more manageable sizes.

### Accountant

_Optional_

Accountant:

-   belongs to a single organization,
-   belongs to [0 ... n] teams, and
-   has [0 ... n] integrations

whose accounting he/she is doing.

</details>

## Getting your first model ready

_Please, note that `/v3` is in active development and any or all of these endpoints and/or methods may fail or change without prior warning._

The steps to get AI Inside by FabricAI working for an integration are:

1. Authenticate with employeeToken to an integration by following steps above
2. POST sessioninfo, coa, dimensions, and fiscalyears `POST /ai/training-data/:dataType`
    - where `const dataType = ['coa', 'dimensions', 'sessioninfo', 'fiscalyears']`
    - the data must conform to the provided interfaces in this repo
    - pass in the data in the body.data of the request, plese, see [POSTing data](#posting-data)
    - this will populate the necessary information for the integration and ultimately for the **model(s)**
3. POST training data `POST /ai/training-data/invoices`
    - at the moment you can post only one invoice at the time
    - it is advisable to
        - always include all invoice's attachment(s) if they are one of the allowed mimeTypes
        - POST all labelled invoices from the last two to three years
    - these include all the samples that you want to use to train the **model**
    - each sample follows interface for invoice (`IFabricaiInvoice`) and will be strictly validated
4. Request **model** training for the desired label(s) by contacting us
    - this will be automated in a while
5. WAIT FOR THE MODEL(S) TO TRAIN
    - once the training is completed, you will see the model(s) by `GET /integrations` > mlModels
6. POST new invoices to get predictions from each **model** `POST /data/models/:actionAndLabels`
    - currently `actionAndLabels` only supports `predict`
    - in the future we will allow selecting appropriate labels on per invoice basis e.g. `predict:ACCOUNT,DIMENSION-project`

### POSTing data

All data must be posted as (stringified) JSON and must conform to the provided interface(s). Add the specific data to be POSTed in the `body.data` property of the request.

For example, when you are POSTing COA, the body of the request would look something like this:

```typescript
// This would have to be strigified and then added to the body of the request
const body: { body: IFabricaiCOA } = {
    data: { ledgerAccountCodes: [{ name: 'Purchases', ledgerAccountCode: '4000' }] },
};
```

You can add extra props to the training invoices to control e.g. data retention and how the invoice should be used to train a model.

```typescript
import { IFabricaiInvoice } from '@fabricai/ai-inside';
const body = {
    data: IFabricaiInvoice,
    // On when to delete this invoice JS timestamp
    // E.g. to delete invoice automatically on 2020-10-05T00:00:00.000Z set this 1601856000000
    retentionPolicy?: number,
    // On whether to select this invoice to train on model (THIS IS NOT IMPLEMENTED AS OF NOW)
    datasetLabels?: string[],
};
```

### About invoices used for training

Whenever you start to use new integration, we will setup a new `dataset` that will include all **LABELLED** invoices. Then, whenever you request a new model to be trained, we will:

-   collect the samples from integration's dataset
-   process the invoices
-   train the model
-   deploy the model
-   make it available for LIVE predictions

All invoices (both training and live) must and will be validated against interface `IFabricaiInvoice`. Please, make sure to use invoice validation(s) in this repo to make sure that you do not POST invalidated data to our API - they will fail.

_To achieve the best possible results for the model, please, use care to fill out as many of the values as possible AND add all the attachment(s) that the invoice has!_

For an example, if you have following invoices (only some values of the first invoiceRow of each invoice is shown)

```typescript
// 1_invoices.json
{   id: "1",
    invoiceRows: [{
        id: "1"
        account: "7680"
    }]
}
// 2_invoices.json
{
    id: "2",
    invoiceRows: [{
        id: "423",
        account: "4000",
        dimensionItemValues: [{
            dimensionId: "project",
            itemId: "John Matrix"
        }]
    }]
}
// 3_invoices.json
{
    id: "3",
    invoiceRows: [{
        id: "uuid-v4-21423-21fdw24",
        account: "7230",
    }]
}
```

This dataset (remember that we always use all the invoices of dataset) would be valid to train a model to predict labels ACCOUNT and DIMENSION-project.

In this case, the training dataset for ACCOUNT would look something like this
|id|label|secretSauce|
| --- | --- | --- |
|1-1|7680| ... |
|2-423|4000| ... |
|3-uuid-v4-21423-21fdw24|7230| ... |

And for DIMENSION-project

| id                      | label       | secretSauce |
| ----------------------- | ----------- | ----------- |
| 1-1                     | UNK         | ...         |
| 2-423                   | John Matrix | ...         |
| 3-uuid-v4-21423-21fdw24 | UNK         | ...         |

Note that we assume that in the DIMENSION-project, each of the invoices should either 1) be assigned a dimension called project OR 2) are actively chosen not to include this dimension.

If you would also have DIMENSION-approval and had posted the data above - we would not be able to train the model. In this case the final dataset would look like:

| id                      | label | secretSauce |
| ----------------------- | ----- | ----------- |
| 1-1                     | UNK   | ...         |
| 2-423                   | UNK   | ...         |
| 3-uuid-v4-21423-21fdw24 | UNK   | ...         |

And we would only have one (1) label `<UNK>` and in this case the model would not make any sense (always predict <UNK> with probability 1)

### Finvoice, TEAPPS and other e-invoice formats (xml or other)

Using an [e-Invoice](https://en.wikipedia.org/wiki/Electronic_invoicing) as the data source is always the preferred option. This way the model will have most data and we do not have to concern ourselves with e.g. [OCR errors](#scanned-PDF-invoices) or other e.g. [user added invoices](#other-invoices).

For Finvoice, TEAPPS and other e-invoices:

-   coerce the xml invoice into [`IFabricaiInvoice`](https://github.com/fabricai/ai-inside/blob/cdfb59768dded37b00a148785fd21585e973f40c/src/interfaces/invoice/index.ts#L6) format
-   make sure that it passes the validation (especially math related to values and totals)
-   add the original xml invoice as an attachment

### Scanned PDF invoices

Using PDF invoice will lead to lower accuracy for model, as we have to contend ourselves with:

-   less data
-   uncertain data
-   OCR errors for images (these are made by **YOUR** digitalization workflow)
-   data parsing / processing errors for data PDFs (these are made by **YOUR** digitalization workflow)

For PDF invoices:

-   try to structure as much of the invoice's data as possible
-   for rest, use placeholders
-   if you do not parse invoiceRows, add them as "According to attachment"
-   make sure that used VAT Rate validates
-   add the original PDF files as attachments

### Other invoices

User added content, e.g. a customer manually adds an invoice to accounting system should be handled the same way as PDF invoice.

Here, make sure to add all attachments to the `IFabricaiInvoice` if they just are allowed `mimeType`.

### Minimum requirements for the dataset

The rule of thumb is to POST all invoices that you have from last two to three years. The more the better.

However, the reality is that not all integrations can have thousands and thousands of invoices. But for training to make any sense, you need to have a minimum of:

-   200 invoices with
-   2 unique labels

This will allow us to train a model, but it will not be that great especially if the number of labels is ~ 50 - 100. Recommended minimum number for invoices for e.g. for 50 unique accounts would be something around 1000 invoices.

### Different model generations

We currently have three (3) options for AI that are used in FabricAI.

-   `CHARMANDER` (price optimized, for smallest firms)
-   `CHARMELEON` (default)
-   `CHARIZARD` (premium, if a lot of data and we really want to achieve best possible accuracy)

At the moment we have only allowed the use of `CHARMELEON` in AI Inside by FabricAI that is best combination between performance and the cost of training / running the model. Please contact us if you wish to test other options.

## General notes

-   invoices are stored in the dataset by the invoice's id as FILES in JSON format
    -   the filename is `{integrationKey}/dataset/{invoiceId}_invoices.json`
    -   if you POST new invoices with same id as before **THIS WILL OVERRIDE** the previous invoice
-   we take privacy and GDPR seriously
    -   all training data is always stored encrypted within the EU
    -   your data never leaves the EU when being processed (unless you POST / GET it outside the EU)
    -   you have full control of the training data and can specify an expiry date
    -   you may, whenever you choose, to delete all training-data and/or live data (programmatic implementation will be provided in the future)
    -   it is advisable that if the counterParty is private individual - you include e.g. Finnish National Identification Number **obfuscated** as 000000-0000 or 000000A0000 for best accuracy

## Future development

These are in no particular order and come without any guarantees

-   allow specifying different datasetTags for invoice
    -   e.g. `{ data: IFabricaiInvoice, datasetTags: [ 'creditCard' ] }` for invoices that should ONLY be used to train models to predict something related to creditCard
    -   this will allow you to use different kind of data for different kind of models (now we use all invoices)
-   allow selecting which models to use per invoice
    -   e.g. `POST /ai/models/:integrationKey/predict:DIMENSION-approval` to only predict which approval flow to apply
    -   NOTE! You can technically predict only one label even now, but this requires you to discard the other predictions that are generated automatically for other labels
-   allow DELETE invoices from dataset
    -   most likely just by `DELETE /ai/training-data/invoices/:invoiceId`
