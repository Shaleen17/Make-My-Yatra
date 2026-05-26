import { Paybarcss } from "./Paybarcss.jsx";

const Paybar = () => {
  const data = localStorage.getItem("buy");
  const res = JSON.parse(data || "{}");
  const livePrice = Number(res?.price?.amount || 0);
  const legacyPrice =
    +res?.departure?.delay === 0 ? 5305 : Number(res?.departure?.delay || 0) * 200;
  const totalAmount = livePrice || legacyPrice || 5305;
  const baseFare = Math.max(totalAmount - 755 + 500, 0);
  const formatAmount = (amount) => `INR ${Number(amount || 0).toLocaleString("en-IN")}`;

  return (
    <Paybarcss>
      <div className="paybar">
        <div className="payment_rs">
          <h3>Fare Summary</h3>
          <div className="inline">
            <h5>Base Fare</h5>
            <p>{formatAmount(baseFare)}</p>
          </div>
          <div className="inline">
            <h5>Fee & Surcharges</h5>
            <p>INR 745</p>
          </div>
          <div className="inline">
            <h5>Other Services</h5>
            <p>INR 10</p>
          </div>
          <div className="inline">
            <h5>Discounts</h5>
            <p>- INR 500</p>
          </div>
          <div className="inline">
            <h3>Total Amount</h3>
            <h3>{formatAmount(totalAmount)}</h3>
          </div>
        </div>
        <div className="promocode">
          <div className="promo_icon">
            <h3>PROMO CODES</h3>
            <img
              alt=""
              src="https://imgak.mmtcdn.com/flights/assets/media/dt/rta_assets/promo-code.png"
            />
          </div>
          <input
            className="code_input"
            type="text"
            placeholder="Enter Promo Code Here"
          ></input>
          <div className="promo_option">
            <h5>MMTSTANC</h5>
            <p>Use and save INR 480</p>
            <p>
              Congratulations. Promo discount of INR 480 applied successfully.
              Now pay only using your Standard Chartered Bank Card to get this
              discount.
            </p>
            <p className="terms_remove">Terms & Condition</p>
            <p className="terms_remove">REMOVE</p>
          </div>
          <div className="promo_option">
            <h5>MMTZEST</h5>
            <p>Use and save INR 400</p>
            <p>
              Congratulations. Promo discount of INR 400 applied successfully.
            </p>
            <p className="terms_remove">Terms & Condition</p>
            <p className="terms_remove">REMOVE</p>
          </div>
        </div>
      </div>
    </Paybarcss>
  );
};

export { Paybar };
