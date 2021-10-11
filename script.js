const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";

// general setting (réglage général)

let gamePlaying = false; // toggle (variable) pour savoir si on joue ou non afin de savoir si on affiche la page d'accueil ou pas
const gravity = 0.5; // gravité assignée à l'oiseeau
const speed = 6.2; // vitesse d'arrivée des poteaux
const size = [51, 36]; // taille de l'oiseau [largeur,hauteur]
const jump = -11.5; //  pour la difficulté du jeux
const cTenth = canvas.width / 10; // divise la largeur de const canvas par 10

// pipe setting configuration des potaux
const pipeWidth = 78; //largeur des potaux
const pipeGap = 270; // distance entre les poteaux (haut et bas)
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth; // Math.random et le calcul pour générer les poteaux de manières aléatoires

// variables qui peuvent évoluer au cours du jeux

let index = 0, // vitesse du fond != de la vitesse des potaux (const speed) effet parallax
  bestScore = 0,
  currentScore = 0,
  pipes = [], // tableaux pour faire apparaitre les potaux de façon aléatoires
  flight, // vol
  flyHeight; // hauteur de vol

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
}; // .map du tableau pour les 3 poteaux (voir google)

const render = () => {
  //fonction pour le rendu
  index++; // incrément de +1 à chaque rappel de const render

  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  ); // function drawImage voir google
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  ); // pour superposer 2 images identiques on ajoute la taille la largeur de l'image(canvas.width)
  // au premier appel de la fonction drawImage mais pas dans la deuxième

  if (gamePlaying) {
    // si gameplay= true alors
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    ); //change l'abscisse pour placer le bird au bord de l'écran voir const cTenth, et flyHeigt (l'ordonnée) sera dynamique
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]); //calcul pour donner des valeurs à flyHeight dans la fonction ci-dessus sans Math.min  canvas.height - size[1] cad en déclarant flyHeight = (flyHeight + flight) bird tombe à l'infini
  } else {
    //sinon
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2; // calcul pour la hauteur de vole et centrer l'oiseau prendre la hauteur .heigth la /2 puis
    // soustraire la taille de l'élément qu'on /2

    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245); // écrire sur un canva .fillText blablabla ,abscisse,ordonée
    ctx.fillText("Cliquez pour jouer", 48, 535);
    ctx.font = "bold 30px courier";
  }

  // pipe display affichage des potaux
  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;
      // top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      console.log(
        ctx.drawImage(
          img,
          432,
          588 - pipe[1],
          pipeWidth,
          pipe[1],
          pipe[0],
          0,
          pipeWidth,
          pipe[1]
        )
      );
      //bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      if (pipe[0] <= -pipeWidth) {
        //si le poteaux quitte l'écran
        currentScore++; //score actuel ++
        bestScore = Math.max(bestScore, currentScore); // verifie le bestscore != de currentScore

        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ]; // spredoperator du [] ...pipes le .slice pour enlever un élément du [] puis en ajouter un un
      }
      // si bird touche un poteau fin de partie  .every pour verifier toutes les conditions d'un[] cf doc google

      if (
        [
          pipe[0] <= cTenth + size[0], // verifie que bird soit bien sur l'axe des y true
          pipe[0] + pipeWidth >= cTenth, // verifie que bird soit bien sur l'axe des y true
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1], // vérifie que bird soit entre les poteaux et que l'un ou l'autre true
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  document.getElementById("bestScore").innerHTML = `Meilleur = ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel = ${currentScore}`;

  window.requestAnimationFrame(render); // boucle la const render
};

setup();
img.onload = render;
document.addEventListener("click", () => (gamePlaying = true)); // passe let gamePlaying en true
window.onclick = () => (flight = jump);
