# Demo 24 - Hosted-agent identity

## Teaching goal

Demonstrate passwordless resource access. The same `DefaultAzureCredential` is passed to Foundry and Azure Blob Storage. Locally it can use the developer's Azure CLI sign-in; after deployment it resolves to the Hosted agent identity.

This is service-to-service authorization for the agent. It is different from identity-aware RAG, where results are filtered according to the end user's identity.

## Prepare the sample policy

1. Create the container named in the root `.env`.
2. Upload `sample_travel_policy.txt` as `travel-policy.txt`.
3. Grant your signed-in classroom identity **Storage Blob Data Reader** for local testing.
4. After deployment, grant the Hosted agent identity **Storage Blob Data Reader** at the narrowest practical scope.

Do not put the storage account key in `.env`. RBAC is the point of this demonstration.

For the supplied classroom storage account, the passwordless setup commands are:

```powershell
az storage container create --name agent-framework-demos --account-name traveldata231 --auth-mode login --public-access off
az storage blob upload --account-name traveldata231 --container-name agent-framework-demos --name travel-policy.txt --file .\sample_travel_policy.txt --auth-mode login --overwrite
```

If the upload is denied, grant the signed-in user **Storage Blob Data Contributor** on the storage account, then retry
the upload. Keep the account key out of source control and rotate any key that has been shared outside Azure.

## Run locally

```powershell
..\venv\Scripts\Activate.ps1
az login
python main.py
```

Ask: `What is the hotel reimbursement limit?`

Then remove or change the Blob role and repeat the request to show that authentication alone does not grant authorization.

## Student lab

In `lab/starter.py`, complete `read_travel_policy` by creating a `BlobClient` with the existing `credential`. Do not use an account key or connection string. Compare with the solution afterward.

## Microsoft sources

- [Agent identity](https://learn.microsoft.com/azure/foundry/agents/concepts/agent-identity)
- [Hosted agents](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents)
- [Authorize access to Blob Storage with Microsoft Entra ID](https://learn.microsoft.com/azure/storage/blobs/authorize-access-azure-active-directory)
