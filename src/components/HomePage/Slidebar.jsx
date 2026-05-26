import 'react-slideshow-image/dist/styles.css'
import { Slide } from "react-slideshow-image";
import { Smallslide } from './Smallslide'

export const MultipleSlidesExample = () => {
  const properties = {
    duration: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    indicators: false,
    transitionDuration: 400,
    infinite: true,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  return (
    <div>
      <Slide {...properties}>
        <div><Smallslide para={'Dharamshala bookings now open — Find pilgrim stays near temples'} image={"/images/Dharmshala/gallery1.jpg"}/></div>
        <div><Smallslide para={'Char Dham Yatra 2026 — Sacred Himalayan pilgrimage packages'} image={"/images/Dharmshala/gallery3.jpg"}/></div>
        <div><Smallslide para={'Explore 250+ verified Dharamshalas across sacred cities'} image={"/images/Dharmshala/gallery5.jpg"}/></div>
        <div><Smallslide para={'Kashi Vishwanath special darshan — Book your guided yatra'} image={"/images/kashi_hero.jpg"}/></div>
        <div><Smallslide para={'Guruvayur temple packages — Complete South India pilgrimage'} image={"/images/card_guruvayur.jpg"}/></div>
      </Slide>
    </div>
  );
};

export const BigSlidesExample = () => {
  const properties = {
    duration: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    indicators: false,
    transitionDuration: 300,
    infinite: true,
    responsive: [{ breakpoint: 769, settings: { slidesToShow: 2 } }],
  };

  return (
    <div style={{width: '90%', margin: 'auto'}}>
      <Slide {...properties}>
        <div className="parentbigslide">
          <div className="bigslideDiv">
            <div className="slide-img-wrap">
              <img src="/images/card_chardham.jpg" alt="Char Dham" />
              <span>Recommended</span>
            </div>
            <div className="slide-content">
              <h3>FEATURED YATRA</h3>
              <h2>Char Dham Yatra — All 4 dhams in one journey</h2>
              <div className="reddiv"></div>
              <p>Complete guided pilgrimage with dharamshala stays</p>
              <h4>Explore →</h4>
            </div>
          </div>
        </div>
        <div className="parentbigslide">
          <div className="bigslideDiv">
            <div className="slide-img-wrap">
              <img src="/images/card_haridwar.jpg" alt="Haridwar" />
              <span>Popular</span>
            </div>
            <div className="slide-content">
              <h3>SACRED JOURNEY</h3>
              <h2>Haridwar-Rishikesh — Ganga Aarti & Yoga Retreat</h2>
              <div className="reddiv"></div>
              <p>5-day spiritual immersion on the banks of Ganga</p>
              <h4>Explore →</h4>
            </div>
          </div>
        </div>
        <div className="parentbigslide">
          <div className="bigslideDiv">
            <div className="slide-img-wrap">
              <img src="/images/card_ayodhya.jpg" alt="Ayodhya" />
              <span>New</span>
            </div>
            <div className="slide-content">
              <h3>RAM MANDIR</h3>
              <h2>Ayodhya Darshan — Visit the grand Ram Mandir</h2>
              <div className="reddiv"></div>
              <p>Special darshan package with Sarayu Ghat aarti</p>
              <h4>Explore →</h4>
            </div>
          </div>
        </div>
        <div className="parentbigslide">
          <div className="bigslideDiv">
            <div className="slide-img-wrap">
              <img src="/images/card_ujjain.jpg" alt="Ujjain" />
              <span>Must Visit</span>
            </div>
            <div className="slide-content">
              <h3>JYOTIRLINGA</h3>
              <h2>Ujjain — Mahakaleshwar Bhasma Aarti experience</h2>
              <div className="reddiv"></div>
              <p>VIP darshan with Shipra river bathing</p>
              <h4>Explore →</h4>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
};
