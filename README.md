# SafePrescribe: Haskell-Powered Pharmacy DApp

A professional decentralized application to prevent prescription duplication (Doctor Shopping).

## The Core Concept
This DApp uses **Haskell (Plutus)** logic to ensure a health prescription is a non-copyable digital asset. 
Once a pharmacist fills the prescription, the on-chain status is updated to `Claimed`. Any attempt to fill
the same prescription at a different pharmacy will be rejected by the Haskell smart contract validator.

## Project Structure
- **/contracts**: Contains `Prescription.hs` (The Haskell/Plutus smart contract logic).
- **/public**: The Vercel-ready frontend (HTML, vanilla JS, Tailwind).
- `vercel.json`: Configuration for instant global deployment.

## Deployment Instructions
1. Upload this structure to a GitHub repository.
2. Link the repository to **Vercel**.
3. Vercel will automatically serve the `public` directory.

## Clinical Workflow
1. **Doctor Portal**: Enter medication details. Issuing the prescription binds it to the Haskell ledger.
2. **Pharmacy Queue**: Pharmacists see a real-time feed of active prescriptions.
3. **Immutability**: Once 'Filled', the item transitions to VOID. The blockchain ensures this state change is irreversible.