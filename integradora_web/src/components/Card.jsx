import React from "react";
import styles from "../styles/card.module.css";

const Card = ({ image, title, description, price }) => {
  return (
      
        <div className={styles.cardContent}>
          <img src={image} alt={title} />
          <div className={styles.cardInfo}>
            <p className={styles.cardTitle}>{title}</p>
            <p className={styles.cardDescription}>{description}</p>
            <p className={styles.cardPrice}>{price}</p>
          </div>
        </div>
      

  );
};

export default Card;
