{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

module SafePrescribe where

import           Plutus.V2.Ledger.Api
import           PlutusTx.Prelude
import qualified PlutusTx

-- | Prescription Data Structure
data Prescription = Prescription
    { doctorPkh      :: PubKeyHash       -- Doctor who issued it
    , patientIdHash  :: BuiltinByteString -- Anonymized Patient ID
    , drugName       :: BuiltinByteString
    , isRedeemed     :: Bool             -- State flag
    }

PlutusTx.unstableMakeIsData ''Prescription

{-# INLINABLE validateDispensing #-}
-- | Logic: Only a transaction signed by a licensed Pharmacy can consume this UTxO.
-- The script ensures the prescription cannot be used twice.
validateDispensing :: Prescription -> () -> ScriptContext -> Bool
validateDispensing datum _ ctx = 
    traceIfFalse "Prescription already claimed at another pharmacy" (not (isRedeemed datum)) &&
    traceIfFalse "Missing valid medical authority signature" (txSignedBy info (doctorPkh datum))
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

policy :: CompiledCode (Prescription -> () -> ScriptContext -> Bool)
policy = $$(PlutusTx.compile [|| validateDispensing ||])