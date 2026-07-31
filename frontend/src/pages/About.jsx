import React from 'react';
import '../css/style_about.css';

const About = () => {
    return (
        <section className="hero">
            <br /><br />
            <div className="details">
                <div className="image" id="image">
                    <img src="/img/about-img.png" className="photo" alt="Group-Pic" />
                </div>

                <div className="content">
                    <h2>About Us</h2>
                    <span>line here</span>
                    <p>We are a team, keen of providing healthy meals to those who sleep empty-belly each night as
                        well as avoiding food wastage by accumulating leftover meals from people who generally used
                        to throw away extra food and ensuring it reaches those who need it.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
