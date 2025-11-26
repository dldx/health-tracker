/**
 * Generate PWA icons from SVG
 * This script generates PNG icons in various sizes for PWA support
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Read the SVG
const svgPath = join(rootDir, 'static', 'favicon.svg');
const svgContent = readFileSync(svgPath, 'utf-8');

console.log('🎨 Generating PWA icons...\n');

// Try to use sharp if available, otherwise provide instructions
try {
	const sharp = await import('sharp');

	for (const size of sizes) {
		const outputPath = join(rootDir, 'static', 'icons', `icon-${size}x${size}.png`);

		await sharp.default(Buffer.from(svgContent))
			.resize(size, size)
			.png()
			.toFile(outputPath);

		console.log(`✓ Generated ${size}x${size} icon`);
	}

	console.log('\n✅ All icons generated successfully!');
} catch (error) {
	console.log('⚠️  Sharp not installed. Installing it now...\n');
	console.log('Run: npm install --save-dev sharp');
	console.log('\nOr use an online tool to convert favicon.svg to PNG icons:');
	console.log('1. Visit: https://realfavicongenerator.net/');
	console.log('2. Upload static/favicon.svg');
	console.log('3. Download and extract icons to static/icons/\n');

	console.log('Required icon sizes:', sizes.map(s => `${s}x${s}`).join(', '));

	// Create a simple HTML generator as fallback
	const htmlGenerator = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Icon Generator</title>
	<style>
		body { font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto; }
		canvas { border: 1px solid #ccc; margin: 0.5rem; }
		.icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
		.icon-item { text-align: center; }
		button { padding: 0.5rem 1rem; margin: 0.5rem; cursor: pointer; }
	</style>
</head>
<body>
	<h1>PWA Icon Generator</h1>
	<p>Right-click each icon and "Save image as..." to download.</p>
	<div class="icon-grid" id="icons"></div>

	<script>
		const svg = \`${svgContent}\`;
		const sizes = ${JSON.stringify(sizes)};
		const iconsDiv = document.getElementById('icons');

		sizes.forEach(size => {
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');

			const img = new Image();
			const blob = new Blob([svg], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(blob);

			img.onload = () => {
				ctx.drawImage(img, 0, 0, size, size);
				URL.revokeObjectURL(url);

				const iconItem = document.createElement('div');
				iconItem.className = 'icon-item';
				iconItem.innerHTML = \`
					<p><strong>\${size}x\${size}</strong></p>
					<img src="\${canvas.toDataURL('image/png')}" width="128" style="max-width: 100%">
					<br>
					<a href="\${canvas.toDataURL('image/png')}" download="icon-\${size}x\${size}.png">
						<button>Download</button>
					</a>
				\`;
				iconsDiv.appendChild(iconItem);
			};

			img.src = url;
		});
	</script>
</body>
</html>`;

	const htmlPath = join(rootDir, 'generate-icons.html');
	writeFileSync(htmlPath, htmlGenerator);
	console.log(`\n📄 Created generate-icons.html - Open this file in your browser to generate icons manually.`);
}

