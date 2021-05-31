export default {
		meta: {
		note:`checking discolorization in Chrome & firefox`,
		author:`tom byrer`,
		destRootFolder:`../avif-results/202105/screenshots/`,
	},
	avif_lossless:{
		browsers:[`canary`,`fxdev`],
		viewport:{
			w:400,
			h:400,
		},
		folders:{
			orig:`https://test-images.github.io/avif/202105/squoosh/losssless7/`,
			destSub:`lossless/`,
			browser_folders: true,
		},
		files:[
			`cs-gray-7f7f7f.avif`,
			`ia-forrest.avif`,
			`pg-coral.avif`,
			`web-jakearchibald.avif`,
		],
	},
}
