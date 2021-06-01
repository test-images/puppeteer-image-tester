import fs from "fs"
import puppeteer from "puppeteer-core"
import batches from "./avif-squoosh.config.js"
import { BROWSERS } from "./.profile,secret.js"

async function main(){
	for (
		let i = 1, // index 0 = meta, no tests
			keyNames = Object.keys(batches),
			curBatch = {};
		i < keyNames.length;
		++i
	){
		curBatch = batches[keyNames[i]]
    captureMultiScreenshots(
      curBatch,
      batches.meta.destRootFolder + curBatch.folders.destSub,
    )
  }
}
main()


async function captureMultiScreenshots(batch, dest) {
  console.log(`current batch`, batch);
  const products = new Map([
    ['canary', 'chrome'],
    ['chrome', 'chrome'],
    ['edge', 'chrome'],
    ['firefox', 'firefox'],
    ['fxdev', 'firefox'],
  ])
  for (
    let b = 0;
    b < batch.browsers.length;
    ++b
  ){
    let browser = null;
    let fileIdx = 0
    const destFolder = (batch.folders.browser_folders===true)
      ? dest + batch.browsers[b] +'/'
      : dest

    try {
      if (BROWSERS[batch.browsers[b]]===undefined){
        throw new Error(`Can not find "${batch.browsers[b]}" config in ".profile,secret.js"`)
      }

      console.log(`Attempting to fill:`, destFolder);
      fs.mkdirSync(destFolder,{recursive:true})

      // launch headless browser
      browser = await puppeteer.launch({
        executablePath: BROWSERS[batch.browsers[b]],
        extraPrefsFirefox: {
          'image.avif.enabled': true,
        },
        headless: false,
        product: products.get(batch.browsers[b]),
      })
      const page = await browser.newPage()
      await page.setViewport({
        width: batch.viewport.w,
        height: batch.viewport.h,
      })

      for (
        let file = '';
        fileIdx < batch.files.length;
        ++fileIdx,
        batch.files[fileIdx]
      ){
        file = batch.files[fileIdx]
        await page.goto(batch.folders.orig + file)
        await page.screenshot({ path: destFolder + file +`.png` })
        console.log(`✅ ${file}`);
      }
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close()
      }
      console.log(`${(batch.files.length===fileIdx)?'🎉 All':'😔 Some'}`, fileIdx, `screenshots in ${batch.browsers[b]} captured for
${destFolder}.`);
    }
  }//end for browsers loop
}
