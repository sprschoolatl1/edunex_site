/* ========================================================
   EDUNEX script.js — Upgraded UI (3D + themes + animated bg)
   - Keeps your topicData EXACTLY as provided (unchanged)
   - Adds: Light/Dark toggle, animated background toggle
   - Adds: subject icons (visual), improved 3D effects
   - Animations applied to every screen change (Option A)
   ======================================================== */
const GEMINI_API_KEY = "AIzaSyDIJyYtqwajZAcxywUQWZGrIFEK3PLFsW4";
/* ---------- Elements ---------- */
const app = document.getElementById("app");
const appContainer = document.getElementById("appContainer");
const themeToggle = document.getElementById("themeToggle");
const bgToggle = document.getElementById("bgToggle");
const bgAnim = document.getElementById("bg-anim");

/* ---------- UI helpers ---------- */

/* ---------- Animation wrapper (Option A everywhere) ---------- */
function animateReplace(newHtml, direction = 'right') {
  if (!app) return;
  let outClass = 'anim-slide-right-out';
  let inClass = 'anim-slide-right-in';
  if (direction === 'left') {
    outClass = 'anim-slide-left-out'; inClass = 'anim-slide-left-in';
  }
  if (direction === 'flip') {
    outClass = 'anim-slide-right-out'; inClass = 'anim-flip-in';
  }

  app.classList.remove(inClass, 'anim-flip-in', 'anim-slide-left-in', 'anim-slide-right-in', 'anim-slide-left-out', 'anim-slide-right-out');
  app.classList.add(outClass);

  setTimeout(() => {
    app.innerHTML = newHtml;
    window.scrollTo(0,0);
    // small theme pulse to give dynamic change feel
    pulseBorder();
    app.classList.remove(outClass);
    app.classList.add(inClass);
  }, 360);
}

/* pulse effect on border */
function pulseBorder(){
  if (!appContainer) return;
  appContainer.style.transition = 'box-shadow .35s, transform .35s';
  appContainer.style.transform = 'translateY(-6px) scale(1.002)';
  setTimeout(()=> appContainer.style.transform = '', 420);
}

/* ---------- Navigation state ---------- */
let currentSubject = null;
let lastMainConcept = null;
let navStack = [];
let currentTopic = null;

/* ---------- Subject icons map ---------- */
const subjectIcons = {
  Maths: '📊',
  Physics: '💡',
  Biology: '🧬',
  Chemistry: '🧪',
  Social: '🌍'
};

/* --------------------------
   1) Class Selection
--------------------------- */
function showClassSelection(){
  generateFloatingIcons();
  currentTopic = null; currentSubject = null; lastMainConcept = null; navStack=[];
  const html = `
    <h1>Select Your Class</h1>
    <div class="grid">
      <div class="card" onclick="showSubjects('Class 6')"><div class="icon">6</div><div class="label">Class 6</div></div>
      <div class="card" onclick="showSubjects('Class 7')"><div class="icon">7</div><div class="label">Class 7</div></div>
      <div class="card" onclick="showSubjects('Class 8')"><div class="icon">8</div><div class="label">Class 8</div></div>
      <div class="card" onclick="showSubjects('Class 9')"><div class="icon">9</div><div class="label">Class 9</div></div>
      <div class="card" onclick="showSubjects('Class 10')"><div class="icon">10</div><div class="label">Class 10</div></div>
    </div>
  `;
  animateReplace(html, 'right');
}

/* --------------------------
   2) Subjects Listing
--------------------------- */
function showSubjects(className){
  generateFloatingIcons();
  currentTopic = null; currentSubject = null; lastMainConcept = null; navStack=[];

  const subjects = ['Maths','Physics','Biology','Chemistry'];
  const cards = subjects.map(s => {
    const icon = subjectIcons[s] || '📘';
    return `<div class="card" onclick="showTopics('${s}')"><div class="icon">${icon}</div><div class="label">${s}</div><div class="desc">Explore ${s}</div></div>`;
  }).join('');

  const html = `
    <h1>Select a Subject (${escapeHtml(className)})</h1>
    <div class="grid">${cards}</div>
    <a onclick="showClassSelection()">← Back to Classes</a>
  `;
  animateReplace(html, 'left');
}

/* --------------------------
   3) Topics Listing
--------------------------- */
function showTopics(subject){
  generateFloatingIcons();
  currentSubject = subject; currentTopic = null; lastMainConcept = null; navStack=[];

  const topics = {
    Physics: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law"],
    Maths: ["Tangents and Secants of Circle","Pythagoras Theorem","Real Numbers"],
    Biology: ["Biodiversity", "Cell Structure", "Photosynthesis"],
    Chemistry: ["Acids,bases and salts", "Metals and Non-Metals"]
  };

  const cards = (topics[subject] || []).map(t => {
    return `<div class="card" onclick="showConcept('${t.replace(/'/g,"\\'")}')"><div class="icon">📚</div><div class="label">${escapeHtml(t)}</div></div>`;
  }).join('');

  const html = `
    <h1>${escapeHtml(subject)} Topics</h1>
    <div class="grid">${cards}</div>
    <a onclick="showSubjects('')">← Back to Subjects</a>
  `;
  animateReplace(html, 'right');
}

/* --------------------------
   4) showConcept(): topicData preserved exactly (unchanged)
   NOTE: I pasted your full topicData object here unchanged.
--------------------------- */

function showConcept(topic){
  generateFloatingIcons();
  currentTopic = topic;

  const topicData = { 
    // Physics Topics
    "Newton's 1st Law": {
      video: "https://www.youtube.com/embed/5oi5j11FkQg",
      text: ` 
        <b>Newton's 1st laws of Motion:</b> A body at rest will remain at rest and a body in motion will continue in motion until and unless any external force is applied on it. This is also called <b>'Law of Inertia'</b>
        <p><strong>Inertia:</strong>The property of any body by virtue of its mass due to which it opposes any change in its state of rest or motion.</p>
         <p><strong>Force:</strong>Push or pull acting on an object.</p>
        `, 
       prerequisites: []
    },
    "Newton's 2nd Law": {
      video: "https://www.youtube.com/embed/8YhYqN9BwB4",
      text: `
        <b>Newton's 2nd laws of Motion:</b> Newton's Second Law of Motion states that an object's acceleration is directly proportional to the net force applied to it and inversely proportional to its mass. It is also called <b> 'Law of Acceleration'</b>.
        
        <p><b>Examples:</b></p>
        <p><strong>1.</strong> Hitting a cricket ball — the harder you hit (more force), the faster it goes. 🏏</p>
        <p><strong>2.</strong> Car engines — more powerful engines apply greater force, giving higher acceleration. 🚘</p>
        
        <p><strong>Net Force:</strong> The overall force acting on an object after combining all the individual forces, considering their directions.</p>
        <p><strong>Mass:</strong> The amount of matter contained in a body; it measures inertia.</p>
        <p><strong>Acceleration:</strong> The rate of change of velocity of an object.</p>
      `,
      prerequisites: []
    },

      "Newton's 3rd Law": {
        video: "https://www.youtube.com/embed/TVAxASr0iUY",
        text:`
               <b>Newton's 3rd laws of Motion:</b>whenever one object exerts a force on a second object, the second object exerts a force of the same magnitude but in the opposite direction on the first object.It is also called<b> 'Law of Action and Reaction'</b>.
        
               <p><b>Examples:</b></p>
               <p><strong>1.</strong>When you push a wall, the wall pushes back on you with an equal force.</p>
               <p><strong>2.</strong>When a rocket launches, the gases push downward, and the rocket moves upward.</p>
             `,
        prerequisites: []
      },
      
      // Maths Topics
      "Algebraic Equations": {
        video: "https://www.youtube.com/embed/vC7QwY84gG8",
        text:"Equations with a combination of variables and constants using arithmetic operations (+, −, ×, ÷).",
        prerequisites: ["Variables and Constants", "Expressions", "Equations"]
      },
      "Variables and Constants": {
        video: "https://www.youtube.com/embed/T5ni8gUk3Sg",
        text:  `
        <p><strong>Variables:</strong>An alphabet or term that represents an unknown number or unknown value or unknown quantity. Which is not constant , it always changes.</p>
        <p><strong>Constants:</strong>A value that never changes and remains the same throughout a given problem or equation.     
  Example : 1,2,3,4,5...........all the numbers.</p>
      `,
      },
      Equations: {
        video: "https://www.youtube.com/embed/0nFZbU1sYbM",
        text: "An equation is a statement that two mathematical expressions are equal, separated by an equal sign (=). ",
        prerequisites: []
      },
       "Tangents and Secants of Circle": {
      video: "https://www.youtube.com/embed/-n1pzh81KA8",
      text: `
        <p><strong>Tangent:</strong> A line that touches a circle at exactly one point (point of tangency). <em>Etymology:</em> from Latin <em>tangere</em> (“to touch”); term popularized by Thomas Fincke (1583).</p>
        <p><strong>Secant:</strong> A straight line that intersects a circle at exactly two distinct points.</p>
      `,
      prerequisites: ["Circle"]
    },
    Circle: {
      video: "https://www.youtube.com/embed/fe323eGOpQw",
      text:"The set of all points in a plane at a fixed distance (radius) from a fixed point (centre).",
      prerequisites: ["Parts of Circle"]
    },
    "Parts of Circle": {
      video: "https://www.youtube.com/embed/SULeam8jQfE",
      text: `
        <p><strong>Centre:</strong> The fixed reference point of the circle.</p>
        <p><strong>Radius:</strong> Distance from the centre to any point on the circle.</p>
        <p><strong>Diameter:</strong> A chord passing through the centre; equal to 2 × radius.</p>
        <p><strong>Circumference:</strong> The boundary (perimeter) of the circle.</p>
        <p><strong>Arc:</strong> A continuous curve between two points on the circle.</p>
        <p><strong>Chord:</strong> A line segment connecting two points on a circle.</p>
        <p><strong>Segment:</strong> Region enclosed by a chord and its arc.</p>
        <p><strong>Sector:</strong> Region enclosed by two radii and the included arc.</p>
      `,
      prerequisites: []
    },
      "Pythagoras Theorem": {
      video: "https://www.youtube.com/embed/2wbSjiRDItA",
      text: `
        <p><strong>Pythagoras Theorem (Right angle triangle):</strong>
        Square of the hypotenuse is equal to sum of the squares of other two sides.
        Baudhāyana, the Indian mathematician, introduced Pythagoras theorem but did not prove it.
        Pythagoras, a Greek mathematician, proved Pythagoras theorem by the proof using similar triangles.</p>

        <p>This proof is based on the proportionality of the sides of three similar triangles.That is, upon the fact that the ratio of any two corresponding sides of similar triangles is the same regardless of the size of the triangles.</p>
      `,
      prerequisites: ["Triangle","Parts of triangle","Right angles"]
    },
        Triangle: {
          video: "https://www.youtube.com/embed/QDHaBw9xoTQ",
          text: `
                <p>Flat, 2-dimensional shape with three straight sides, three angles, and three corners.</p> 
                
                <p><strong>Key Characteristics</strong>
                <p><strong>Three Sides:</strong>It is defined by three straight line segments.
                <p><strong>Three Angles:</strong>These are the points where the sides meet. 
                <p><strong>Three Vertices:</strong>These are the corners of the shape. 
                <p><strong>Closed shape:</strong>The sides connect to form a complete, enclosed area. 
                <p><strong>Sum of Interior Angles:</strong>The total of the three angles inside the triangle is always 180 degrees.</p>
              `,  
          prerequisites: []
        },
         "Parts of triangle": {
          video: "https://www.youtube.com/embed/QlgFqd1HCz4",
          text: `
                <p><strong>Sides:</strong>These are the three straight line segments that make up the triangle's shape.
                <p><strong>Vertices:</strong>These are the three points where the sides of the triangle connect. Think of them as the corners of the triangle. 
                <p><strong>Angles:</strong> These are the three internal "corners" or spaces formed by the sides where they meet at the vertices. The sum of these three angles inside any triangle always adds up to 180 degrees. 
                <p><strong>*</strong>Longest side (opposite to 90 degree) is hypotenuse other two  sides are base and adjacent.</p> 
              `,  
          prerequisites: []
        },
          "Right angles": {
          video: "https://www.youtube.com/embed/Ge2Kgp6URz4",
          text: `
                <p>An angle that is exactly equal to 90 degrees (or π/2) in measure.</p> 
              `,  
          prerequisites: ["Angle"]
        },
          "Angle": {
          video: "https://www.youtube.com/embed/NY8PFdn-fVI",
          text: ` The shape formed by two lines or rays that meet at a common endpoint, called the vertex.
                <p><strong>Vertex:</strong>The common point where the two lines meet.
                <p><strong>Arms(or sides):</strong>The two straight lines or rays that form the angle.
                <p><strong>Examples:</strong>
                <p><strong>1)</strong>The corner of a square is an angle.
                <p><strong>2)</strong>The point of a slice of pizza is an angle.   
              `,  
          prerequisites: []
        },
          "Real Numbers": {
          video: "https://www.youtube.com/embed/4IQZ83iUBjI",
          text: `
                <p>It is the combination of Rational and Irrational Numbers.</p> 
                <p><strong>Rational Numbers:</strong>The number that can be expressed as a fraction of two integers, where the denominator is not zero. Or p/q form where q is not equal to zero (0).</p>
                <p><strong>Irrational Numbers:</strong>An irrational number is a real number that cannot be expressed as a simple fraction ((p/q), where (p) and (q) are integers and (q) is not zero.</p>

                <p>In decimal form, an irrational number has a non-terminating and non-repeating expansion, meaning its digits go on forever without a repeating pattern.</p>
                <p>Common examples include pi (π) and the square root of 2 (√2).</p> 
                <p><strong>Key Characteristics:</strong>
                <p><strong>=>Cannot be a fraction:</strong> The most fundamental definition is that an irrational number cannot be written as a ratio of two integers.</p>
                <p><strong>=>Non-terminating decimal:</strong> The decimal representation of an irrational number goes on forever and never ends.</p>
                <p><strong>=>Non-repeating decimal:</strong>There is no repeating sequence of digits in the decimal expansion.</p>
              `,  
          prerequisites: ["Integers"]
        },
        "Integers": {
          video: "https://www.youtube.com/embed/AF31lWJJSgg",
          text:"Integers are defined as a set of all whole numbers (positive numbers and zero) combined with all negative numbers.",
          prerequisites: ["Whole Numbers","Negative Numbers"]
        },
        "Whole Numbers": {
          video: "https://www.youtube.com/embed/a_wcpQxnruk",
          text: "Natural numbers including zero",
          prerequisites: ["Natural Numbers"]
        },
        "Negative Numbers": {
          video: "https://www.youtube.com/embed/6U1kCOuNpR4",
          text: "Numbers with a value less than zero, represented by a minus sign (-).",
          prerequisites: []
        },
        "Natural Numbers": {
          video: "https://www.youtube.com/embed/ZSYUkIQI9p4",
          text: "The positive integers used for counting and ordering, starting from 1 and continuing infinitely (1, 2, 3, 4, ...).",
          prerequisites: []
        },

        // Biology
        Biodiversity: {
          video: "https://www.youtube.com/embed/rclOz8Fsbmg",
          text: "The variety of life on Earth, including all organisms and the ecosystems they inhabit.",
          prerequisites: ["Ecosystem", "Food chain"]
        },
        Ecosystem: {
          video: "https://www.youtube.com/embed/cf2WIogQKGk",
          text: "A community where living and non-living things interact.",
          prerequisites: []
        },
        "Food chain": {
          video: "https://www.youtube.com/embed/A1cckiYONpo",
          text: "Who eats whom in an ecosystem; shows transfer of energy and matter.",
          prerequisites: ["Producers,Consumers,Decomposers"]
        },
        "Cell Structure": {
          video: "https://www.youtube.com/embed/URUJD5NEXC8",
          text: "Cells are basic units of life; eukaryotic cells contain a nucleus and other organelles.",
          prerequisites: ["Nucleus", "Cytoplasm", "Cell organelles"]
        },
        Nucleus: {
          video: "https://www.youtube.com/embed/8yLNC2BPnyM",
          text: "The nucleus stores DNA and controls cellular activities.",
          prerequisites: []
        },
        Cytoplasm: {
          video: "https://www.youtube.com/embed/Swv-Cf4eDbs",
          text: "Cytoplasm is the gel-like fluid where organelles are suspended.",
          prerequisites: []
        },
        "Cell organelles": {
          video: "https://www.youtube.com/embed/eS-kn6zfOgA",
          text: "Organelles are specialized structures within cells that perform specific functions.",
          prerequisites: ["Membrane Bound Organelles", "Non-Membrane Bound Organelles"]
        },
        "Membrane Bound Organelles": {
          video: "https://www.youtube.com/embed/FaU7E6wYkG4",
          text: "Organelles enclosed by membranes (e.g., mitochondria, plastids, ER, Golgi).",
          prerequisites: ["Endoplasmic Reticulum","Golgi Appartus","Mitochondria","Vacuoles","Plastids"]
        },
        "Non-Membrane Bound Organelles": {
          video: "https://www.youtube.com/embed/Z0xpwwgBP-k",
          text: "Organelles not enclosed by membranes (e.g., ribosomes, centrosomes).",
          prerequisites: ["Ribosomes","Centrosomes"]
        },
        "Endoplasmic Reticulum": {
          video: "https://www.youtube.com/embed/NRiJhzYE4Ko",
          text: "The endoplasmic reticulum (ER) is a network of membranes found within the cytoplasm of eukaryotic cells, acting as a transportation system and processing center for proteins and lipids.",
          prerequisites: []
        },
        "Golgi Appartus": {
          video: "https://www.youtube.com/embed/j2_g1CZCaPs",
          text: "The Golgi apparatus is like a cell's post office. It receives, modifies, packages, and ships out proteins and lipids.",
          prerequisites: []
        },
        Mitochondria: {
          video: "https://www.youtube.com/embed/c4JsEBI9u6I",
          text: "Mitochondria are the power plants of cells. They are tiny structures inside most cells that generate the energy the cell needs to function.",
          prerequisites: []
        },
        Vacuoles: {
          video: "https://www.youtube.com/embed/9Qn68ZTbGF8",
          text: "A vacuole is a membrane-bound sac in a cell's cytoplasm that stores water, nutrients, and waste products.",
          prerequisites: []
        },
        Plastids: {
          video: "https://www.youtube.com/embed/VdV8kGWd0Jc",
          text: "Plastids are double-membrane organelles in plant and algal cells responsible for food production, storage, and synthesis of pigments. ",
          prerequisites: []
        },
        Ribosomes: {
          video: "https://www.youtube.com/embed/WjnUJusSYAo",
          text: "Ribosomes are essential cellular structures, found in both prokaryotic and eukaryotic cells, that serve as the sites of protein synthesis.",
          prerequisites: []
        },
        Centrosomes: {
          video: "https://www.youtube.com/embed/xOJNwtsLLhw",
          text: "A centrosome is a cellular structure involved in the process of cell division.",
          prerequisites: []
        },  
        Photosynthesis: {
          video: "https://www.youtube.com/embed/UPBMG5EYydo",
          text: "Plants make food using sunlight, carbon dioxide, and water to produce glucose and oxygen.",
          prerequisites: ["Chloroplast", "Stomata"]
        },
        Chloroplast: {
          video: "https://www.youtube.com/embed/UJSBxHGQjcI",
          text: "Chloroplasts contain chlorophyll and are the site of photosynthesis.",
          prerequisites: []
        },
        Stomata: {
          video: "https://www.youtube.com/embed/KJfSl0L6LqU",
          text: "Stomata are tiny pores or openings on plant surfaces, primarily on leaves, that regulate gas exchange and water loss.",
          prerequisites: ["Epidermis"]
        },
        Epidermis: {
          video: "https://www.youtube.com/embed/GXmKPgtLUVw",
          text: "Epidermis is the outermost layer of cells that covers the entire plant body, including leaves, stems, roots, and flowers.",
          prerequisites: []
        },
        "Producers,Consumers,Decomposers": {
          video: "https://www.youtube.com/embed/gQfR5xt6DLo",
          text: `
            <ul>
             <li><strong>Producers:</strong> Plants (and some algae) make their own food using sunlight, water, and carbon dioxide through photosynthesis.</li>
             <li><strong>Consumers:</strong> Animals that eat other organisms to get energy.
               <ul>
                <li><strong>Primary consumers:</strong> Herbivores that eat plants.</li>
                  <li><strong>Secondary consumers:</strong> Carnivores/omnivores that eat herbivores.</li>
                <li><strong>Tertiary consumers:</strong> Top predators that eat secondary consumers.</li>
               </ul>
             </li>
             <li><strong>Decomposers:</strong> Fungi and bacteria that break down dead plants and animals, returning nutrients to the soil.</li>
           </ul>
          `,
          prerequisites: []
        },

        // Chemistry Topics
        "Acids,bases and salts": {
          video: "https://www.youtube.com/embed/Seh0JLRfN_k",
          text: `
                    <p><strong>Acids:</strong>Acids are substances that produce hydrogen ions (H⁺) when dissolved in water and turn blue litmus red.</p>
                    <p>Examples:HCl, H₂SO₄, CH₃COOH</p>
                    <p><strong>Bases:</strong>Bases are substances that produce hydroxide ions (OH⁻) when dissolved in water and turn red litmus blue.</p>
                    <p>Examples:NaOH, KOH, Ca(OH)₂</p>
                    <p><strong>Salts:</strong>Salts are neutral substances formed when an acid reacts with a base, in a reaction known as neutralization.</p>
                    <p>Examples:HCl + NaOH → NaCl + H₂O</p>
                  `,       
          prerequisites: ["Indicators"]
     },
      "Indicators": {
        video: "https://www.youtube.com/embed/4m3U9USwKwA",
        text: `
            <p>Indicators are substances that show a change in colour or smell when added to an acid or a base, helping us identify whether a solution is acidic, basic, or neutral.</p>


            <p><strong>🧪 Types of Indicators</strong></p>
            <p>Indicators are mainly two types:</p>


            <div style="display: flex; justify-content: center; flex-direction: column; align-items: center; margin-top: 15px;">
                
                <div style="background-color: #5B2C83; color: white; font-weight: bold; padding: 10px 40px; border-radius: 8px; width: 350px; text-align: center; margin-bottom: 0px;">
                    Indicators
                </div>
                
                <div style="position: relative; width: 450px; height: 30px; margin-top: 0px;">
                    
                    <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); width: 300px; height: 2px; background-color: #333;"></div>
                    
                    <div style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 2px; height: 7px; background-color: #333;"></div>
                    
                    <div style="position: absolute; top: 7px; left: 75px; width: 2px; height: 23px; background-color: #333;"></div>
                    
                    <div style="position: absolute; top: 7px; right: 75px; width: 2px; height: 23px; background-color: #333;"></div>
                    
                </div>
                
                <div style="display: flex; justify-content: space-between; width: 450px; margin-top: 0;">
                    
                    <div style="text-align: center; width: 200px;">
                        <div style="background-color: #007BFF; color: white; font-weight: bold; padding: 10px 15px; border-radius: 8px;">
                            Natural Indicators
                        </div>
                        <div style="width: 2px; height: 10px; background-color: #333; margin: 0 auto;"></div>
                        
                        <div style="border: 2px solid #007BFF; border-radius: 8px; padding: 8px 10px; font-size: small;">
                            Ex: Litmus, Turmeric, Red Cabbage, Hibiscus
                        </div>
                    </div>
                    
                    <div style="text-align: center; width: 200px;">
                        <div style="background-color: #FF5733; color: white; font-weight: bold; padding: 10px 15px; border-radius: 8px;">
                            Synthetic Indicators
                        </div>
                        <div style="width: 2px; height: 10px; background-color: #333; margin: 0 auto;"></div>
                        
                        <div style="border: 2px solid #FF5733; border-radius: 8px; padding: 8px 10px; font-size: small;">
                            Ex: Phenolphthalein, Methyl Orange
                        </div>
                    </div>
                </div>
            </div>


            <br>
            <p><strong>🌿 1. Natural Indicators:</strong> Obtained from plants and show colour changes in acids and bases.</p>
            <p><strong>⚗️ 2. Synthetic Indicators:</strong> Man-made chemical substances that change colour depending on acidity or basicity.</p>
        `,
        prerequisites: []
    }, 
    // Inside topicData object, add this new topic
    "Metals and Non-Metals": {
        video: "https://www.youtube.com/embed/VD6KpOWl9yA", // Replace with relevant video
        text: `
          <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div style="flex:1; border:2px solid #007BFF; padding:15px; border-radius:8px;">
              <h3 style="text-align:center; color:#007BFF;">Metals</h3>
              <p>• Mostly solids at room temperature (except mercury).</p>
              <p>• Can be hammered or rolled into thin sheets (malleable) and drawn into wires (ductile).</p>
              <p>• Shine with a metallic luster.</p>
              <p>• Conduct heat and electricity efficiently.</p>
              <p>• Usually lose electrons to form positive ions (cations).</p>
            </div>
            <div style="flex:1; border:2px solid #FF5733; padding:15px; border-radius:8px;">
              <h3 style="text-align:center; color:#FF5733;">Non-Metals</h3>
              <p>• Can exist as solids, liquids, or gases at room temperature.</p>
              <p>• Brittle and break easily when solid.</p>
              <p>• Have a dull appearance; lack metallic shine.</p>
              <p>• Poor conductors of heat and electricity.</p>
              <p>• Usually gain electrons to form negative ions (anions).</p>
            </div>
          </div>
        `,
        prerequisites: ["Physical properties","Chemical properties"]
    },
     "Physical properties": {
        video: "https://www.youtube.com/embed/v=r9v_hVZmrg", // Replace with relevant video
        text: `
          <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div style="flex:1; border:2px solid #007BFF; padding:15px; border-radius:8px;">
              <h3 style="text-align:center; color:#007BFF;">Metals</h3>
              <p>• Mostly solid at room temperature (except mercury).</p>
              <p>• Shiny and lustrous appearance.</p>
              <p>• Malleable (can be hammered into thin sheets).</p>
              <p>• Ductile (can be drawn into wires).</p>
              <p>• Good conductors of heat and electricity.</p>
              <p>• High melting and boiling points.</p>
              <p>• Dense and hard (mostly).</p>
            </div>
            <div style="flex:1; border:2px solid #FF5733; padding:15px; border-radius:8px;">
              <h3 style="text-align:center; color:#FF5733;">Non-Metals</h3>
              <p>• Can be solid, liquid, or gas at room temperature.</p>
              <p>• Dull appearance; not shiny.</p>
              <p>• Brittle and break easily when solid.</p>
              <p>• Poor conductors of heat and electricity (insulators).</p>
              <p>• Low melting and boiling points.</p>
              <p>• Less dense compared to metals.</p>
            </div>
          </div>
        `,
        prerequisites: []
    },
    "Chemical properties": {
        video: "https://www.youtube.com/embed/RFiluaD6pLY", // Replace with relevant video
        text: `
          <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div style="flex:1; border:2px solid #007BFF; padding:15px; border-radius:8px;">
              <h3 style="text-align:center; color:#007BFF;">Metals</h3>
              <p>• React with oxygen to form basic oxides (e.g., 2Mg + O₂ → 2MgO).</p>
              <p>• React with water (some metals) to form hydroxides and hydrogen gas (e.g., 2Na + 2H₂O → 2NaOH + H₂).</p>
              <p>• React with acids to produce hydrogen gas (e.g., Zn + 2HCl → ZnCl₂ + H₂).</p>
              <p>• Tend to lose electrons and form positive ions (cations).</p>
              <p>• React with non-metals to form ionic compounds (salts).</p>
            </div>
            <div style="flex:1; border:2px solid #FF5733; padding:15px; border-radius:8px;">
              <h3 style="text-align:center; color:#FF5733;">Non-Metals</h3>
              <p>• React with oxygen to form acidic oxides (e.g., C + O₂ → CO₂).</p>
              <p>• React with hydrogen to form hydrides (e.g., H₂ + Cl₂ → 2HCl).</p>
              <p>• React with metals to form salts (e.g., Na + Cl → NaCl).</p>
              <p>• Tend to gain electrons and form negative ions (anions).</p>
              <p>• Do not usually react with acids to produce hydrogen.</p>
            </div>
          </div>
        `,
        prerequisites: []
    },
  }; // end topicData

  const data = topicData[topic];
  if (!data) {
    const html = `<h1>No data found for "${escapeHtml(topic)}"</h1><div><a onclick="showTopics('${currentSubject}')">← Back to Topics</a></div>`;
    animateReplace(html, 'left');
    return;
  }

  // ensure info text starts with bold name
  let infoText = (data.text || '').trim();
  if (infoText && !infoText.startsWith("<b>") && !infoText.startsWith("<h")) {
    infoText = `<b>${escapeHtml(topic)}:</b> ${infoText}`;
  }

  const prereqButtons = (data.prerequisites || []).map(p => {
    const safe = p.replace(/'/g, "\\'");
    return `<button class="prereq-button" onclick="showPrereqFrom('${safe}','${topic.replace(/'/g, "\\'")}')">${escapeHtml(p)}</button>`;
  }).join('');

  let backLinksHtml = `<div style="margin-top:12px">`;

  if (!lastMainConcept) {
    backLinksHtml += `<div style="margin-top:12px"><a onclick="showTopics('${currentSubject || ''}')">← Back to Topics</a></div>`;
  } else {
    if (navStack.length > 1) {
      const prevName = navStack[navStack.length - 1];
      backLinksHtml += `<div style="margin-top:8px;">
        <a onclick="backToPrereq()">← Back to Prerequisite: ${escapeHtml(prevName)}</a>
        </div>`;
      }
    if (lastMainConcept && lastMainConcept !== topic) {
      backLinksHtml += `<div style="margin-top:8px;">
        <a onclick="backToMainConcept()">← Back to Main Concept: ${escapeHtml(lastMainConcept)}</a>
      </div>`;
    }
  }
  backLinksHtml += `</div>`;

  const html = `
    <h1>${escapeHtml(topic)}</h1>
    <iframe src="${data.video}" allowfullscreen></iframe>
    <div class="text-box">${infoText}</div>
    <h3 style="text-align:center;">Prerequisites:</h3>

<div class="prereq-container">
  ${prereqButtons || "<p>No prerequisites</p>"}
</div>

<div class="ask-ai-container">
  <button class="ask-ai-btn" onclick="askAI('${topic.replace(/'/g, "\\'")}')">🤖 Ask AI</button>
</div>

${backLinksHtml}

  `;

  animateReplace(html, 'flip');
}

/* ---------- prerequisite helpers ---------- */
function showPrereqFrom(prereq, parentTopic){
  navStack.push(parentTopic);
  if (!lastMainConcept) lastMainConcept = parentTopic;
  showConcept(prereq);
}
function backToPrereq(){
  if (navStack.length === 0) {
    if (currentSubject) showTopics(currentSubject);
    else showClassSelection();
    return;
  }
  const prev = navStack.pop();
  showConcept(prev);
}
function backToMainConcept(){
  const parent = lastMainConcept;
  lastMainConcept = null;
  navStack = [];
  if (parent) showConcept(parent);
  else { if (currentSubject) showTopics(currentSubject); else showClassSelection(); }
}

/* ---------- Ask AI placeholder ---------- */
function askAI(topic){
  // placeholder: open chat in new window (you may replace with your chat integration)
  window.open("chat.html", "AI Chat", "width=480,height=720");
}
function openChat(){ askAI(currentTopic || ''); }

/* ---------- small utilities ---------- */
function escapeHtml(text) {
  return String(text || '').replace(/[&<>"']/g, function (m) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m];
  });
}

/* ---------- start app ---------- */
setTimeout(()=> showClassSelection(), 80);
async function askGemini(text) {
    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY;

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text }]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        console.log("Gemini Response:", data);

        return (
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I didn't understand that."
        );
    } catch (error) {
        console.error("Gemini error:", error);
        return "⚠️ Error reaching Gemini AI";
    }
}
/* ==========================================================
   RANDOM FLOATING ICON GENERATOR (10 ICONS EVERY PAGE)
   ========================================================== */

const allEduIcons = [
  "📘","📚","📖","📒","📕","📗","📙",
  "✏️","🖊️","📝","📐","📏","📊","📎","🧮",
  "🔬","🧪","🧫","🧬","⚗️","🧲","💡","💭",
  "🎒","🎓","🏫","🌐","🔢","➗","➕","➖","✖️",
  "🔭","🧠","📂","📁","📌","📜"
];

/* ==========================================================
   FLOATING ICONS ALWAYS OUTSIDE WHITE BOX
   ========================================================== */

/* ==========================================================
   FLOATING ICONS SURROUND BLUE BOX ON ALL SIDES
   ========================================================== */

function generateFloatingIcons() {
  const container = document.getElementById("floatingIcons");
  if (!container) return;

  const box = document.getElementById("appContainer");
  const rect = box.getBoundingClientRect();

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const icons = [
    "📘","📚","📖","✏️","📝","📐","📏","📊","🧮",
    "💡","🔬","🧪","🧬","🎓","🏫","📙","🧲",
    "📎","🔭","🧠","🔢","➗","➕","➖","✖️",
  ];

  let html = "";

  // generate 12 icons: 3 top, 3 bottom, 3 left, 3 right
  for (let i = 0; i < 12; i++) {
    const icon = icons[Math.floor(Math.random() * icons.length)];

    let top, left;

    if (i < 3) {
      // TOP ZONE
      top = Math.random() * (rect.top - 80);
      left = Math.random() * screenW;
    } else if (i < 6) {
      // BOTTOM ZONE
      top = rect.bottom + Math.random() * (screenH - rect.bottom - 80);
      left = Math.random() * screenW;
    } else if (i < 9) {
      // LEFT ZONE
      top = rect.top + Math.random() * rect.height;
      left = Math.random() * (rect.left - 80);
    } else {
      // RIGHT ZONE
      top = rect.top + Math.random() * rect.height;
      left = rect.right + Math.random() * (screenW - rect.right - 80);
    }

    const duration = 6 + Math.random() * 4;

    html += `
      <span class="ficon"
            style="top:${top}px; left:${left}px; animation-duration:${duration}s;">
        ${icon}
      </span>
    `;
  }

  container.innerHTML = html;
}


/* ======================================================
   CALCULATE APP-CONTAINER POSITION FOR ICON EXCLUSION
   ====================================================== */

function updateAppBoxPosition() {
  const box = document.getElementById("appContainer");
  if (!box) return;

  const rect = box.getBoundingClientRect();

  document.documentElement.style.setProperty("--calc-app-left", rect.left + "px");
  document.documentElement.style.setProperty("--calc-app-top", rect.top + "px");
  document.documentElement.style.setProperty("--calc-app-width", rect.width + "px");
  document.documentElement.style.setProperty("--calc-app-height", rect.height + "px");

  document.body.classList.add("layout-ready");
}

window.addEventListener("resize", updateAppBoxPosition);
setTimeout(updateAppBoxPosition, 300);

