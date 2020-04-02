import React, { useState, useEffect } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom'; 
function ResponsiveNavigation({ background, hoverBackground, linkColor, navLinks, logo, navbarCheckFunc }) {
    const [ navOpen, setNavOpen ] = useState(true)
    const [ hoverIndex, setHoverIndex ] = useState(-1)
    const [ clickIndex, setClickIndex ] = useState(-1)
   
    useEffect(() => {
        const x = window.matchMedia("(max-width: 768px)")
        function myFunction(e) {
           if (e.matches) {
            setNavOpen(!navOpen);
            navbarCheckFunc(navOpen);
           }
           else{
            setNavOpen(navOpen);
            navbarCheckFunc(!navOpen);
           }
          
        };
        x.addListener(myFunction)
        return () => x.removeListener(myFunction);
      }, []);

  
    return (
      
        <nav
            className="responsive-toolbar"
            style={{ background:  background }}>
           
            <ul
                style={{ background: "#fff" }}
                className={ navOpen ? 'active' : '' }
                id={ navOpen ? 'activeNav' : 'noActiveNav' }
            >
                <figure className="image-logo" onClick={ () => { setNavOpen(!navOpen);navbarCheckFunc(navOpen);} }>
                    <img src={ logo } height="40px" width="40px" alt="toolbar-logo" />
                </figure>
                { navLinks.map((link, index) => 
                    <li
                        key={ index }
                        onMouseEnter={ () => { setHoverIndex(index) } }
                        onMouseLeave={ () => { setHoverIndex(-1) } }
                        onClick={ () => { setClickIndex(index)} }
                        style={{ background: hoverIndex === index ? (hoverBackground || '#D7D7D7') : '' }}
                    >
                        <Link
                            to={link.path}
                            style={{ color: linkColor }}
                        >   { link.text }
                            <i className={ link.icon } />
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default ResponsiveNavigation