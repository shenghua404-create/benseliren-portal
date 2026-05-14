export default function NavBar({ items }) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="本色丽人首页">
        <span className="brand-symbol">本</span>
        <span>本色丽人</span>
      </a>
      <nav className="main-nav" aria-label="主导航">
        {items.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
