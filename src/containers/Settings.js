import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Elements, StripeProvider } from "react-stripe-elements";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import BillingForm from "../components/BillingForm";
import config from "../config";
import "./Settings.css";

export default function Settings(props) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  async function handleFormsubmit(storage, { token, error }) {
    if(error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id
      });

      alert("Your card has been charged successfully!");
      history.push("/");
    } catch(e) {
      onError(e);
      setIsLoading(false);
    }
  }


  function billUser(details) {
    return API.post("notes", "/billing", {
      body: details
    });
  }

  return (
    <div className="Settings">
      <StripeProvider stripe={stripe}>
        <Elements>
          <BillingForm isLoading={isLoading} onSubmit={handleFormsubmit} />
        </Elements>
      </StripeProvider>
    </div>
  );
}