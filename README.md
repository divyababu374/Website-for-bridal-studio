# Indhu Bridal Studio - Website Documentation

A premium, responsive, and interactive website designed for **Indhu Bridal Studio** (located in Alangayam, Tirupattur, Tamil Nadu). This site showcases bridal transformations, signature services, and facilitates seamless bookings via direct integration with WhatsApp.

*   **Hosted Live URL:** [https://indhubridalstudio.vercel.app/](https://indhubridalstudio.vercel.app/)

---

## 🌟 Key Features

1. **Premium Responsive Design**
   * Mobile-first navigation system featuring a glassmorphic floating top navbar on desktop and a dynamic overlay-based sidebar on mobile.
   * Curated typography (`Playfair Display` for elegance, `Poppins` for high readability).
   * Soft plum, gold, and white color palette suited for a luxury bridal aesthetic.

2. **3D Coverflow Service Carousel**
   * Features signature services like Bridal Makeup, Hair Styling & Saree Draping, Mehendi Artistry, and Bridal Jewellery.
   * Displays interactive elements, smooth scale animations, progress bars, and active slide counters.

3. **Interactive Media Gallery & Lightbox**
   * Fluid photo and video grid showcasing past bridal work, including custom play overlays for videos.
   * An immersive fullscreen image lightbox modal supporting keyboard navigation (`Esc`, `Left`, `Right` arrows), drag/click outer dismiss, and swipe behavior.

4. **Instant Booking Engine (WhatsApp Integrated)**
   * Customized appointment booking form prompting for Name, Contact Number, Venue/Location, Date, Occasion, Service type, and custom notes.
   * Automatically validates input details (e.g., sets the calendar's minimum date dynamically to *today* to prevent past booking errors).
   * Generates a beautifully formatted markdown message block and forwards the client straight to WhatsApp to finalize details.
   * Triggers a recovery/confirmation toast on returning to the browser window.

---

## 📂 Project Structure

```bash
Website-for-bridal-studio/
├── images/                      # Media assets (JPEG/PNG/MP4/Logo/Favicons)
├── index.html                   # Main page layout containing structure, Gallery grid & Modal
├── jewellery.html               # Dedicated showcase for bridal jewellery collections
├── luxury-hero.css              # Custom styling for top-fold premium hero section
├── luxury-hero.js               # Logic for cycling hero background slides
├── luxury-services.css          # Styling for the 3D coverflow carousel & pills grid
├── luxury-services.js           # Core layout logic and interactions for the coverflow
├── script.js                    # Global logic (Scroll trackers, Testimonial loop, Booking validation)
├── style.css                    # Core utility classes, globals, typography and layout variables
└── README.md                    # Project documentation (this file)
```

---

## 🚀 Running & Testing Locally

### 1. Locally on your Computer
You can serve these files with any static server. If you have Python installed, run:
```powershell
python -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your web browser.

### 2. Testing in your Local Network (Wi-Fi/Ethernet)
To preview the website on other devices (e.g., mobile phone, tablet) connected to the same local network:

1. Start the server on all network interfaces:
   ```powershell
   python -m http.server 8000 --bind 0.0.0.0
   ```
2. Find your local IP address using `ipconfig` (Windows) or `ifconfig` (macOS/Linux).
3. Access the website on your testing device using your IP:
   ```
   http://<YOUR_LOCAL_IP>:8000
   ```

---

## 🛠 Customization & Code Guides

### Adding new items to the Gallery
To append new transformations to the gallery section, open [index.html](file:///e:/Website-for-bridal-studio/index.html) and locate the `<div class="gallery-grid" id="galleryGrid">` block. Add a new `div` structured like this:

```html
<div class="gallery-item" data-index="16" data-src="images/your-image.jpeg" data-caption="Your Custom Caption">
  <img src="images/your-image.jpeg" alt="Your Custom Caption" loading="lazy" />
</div>
```
> [!IMPORTANT]
> Ensure the `data-index` attributes remain sequential (`0, 1, 2, ...`). The lightbox relies on sequential indices to manage the next/previous navigation correctly.

### Changing the WhatsApp Recipient
To route the generated booking messages to a different studio phone number, update [script.js](file:///e:/Website-for-bridal-studio/script.js) around line 111:
```javascript
const whatsappURL = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`;
```
Replace `91XXXXXXXXXX` with the country code followed by the mobile number (with no spaces, dashes, or `+` signs).
