export default function Footer() {
  const values = [
    ["✦", "100% AUTHENTIC", "Godavari products"],
    ["◌", "NO PRESERVATIVES", "Only natural ingredients"],
    ["⌁", "TRADITIONAL RECIPES", "Made the traditional way"],
    ["◈", "SUPPORT LOCAL", "Empowering local communities"],
  ];
  return <footer id="contact" className="footer-v2">
    <div className="footer-values"><div className="container-wide footer-values-grid">{values.map(([icon, title, desc]) => <div key={title} className="footer-value"><span>{icon}</span><div><strong>{title}</strong><small>{desc}</small></div></div>)}</div></div>
    <div className="container-wide footer-main"><div className="footer-brand"><div className="footer-logo">GODAVARI <span>BASKET</span></div><p>More than a basket of products — a way to experience the authentic character of the Godavari region.</p><div className="footer-social"><a href="#">IG</a><a href="#">WA</a><a href="#">FB</a></div></div><div><h3>EXPLORE</h3><a href="#collections">Godavari Foods</a><a href="#collections">Farm & Natural</a><a href="#collections">Handicrafts</a><a href="#collections">Traditional & Cultural</a></div><div><h3>DISCOVER</h3><a href="#collections">Pooja & Spiritual</a><a href="#gifting">Gifts</a><a href="#collections">Special Collections</a><a href="#about">Our Story</a></div><div><h3>HELP</h3><a href="#contact">Contact</a><a href="#shop">Shop</a><a href="#contact">Shipping & Delivery</a><a href="#contact">Returns & Refunds</a></div></div>
    <div className="footer-bottom"><div className="container-wide"><span>© 2026 Godavari Basket. All rights reserved.</span><span>Rooted in the Godavari region, made for everywhere.</span></div></div>
  </footer>;
}
