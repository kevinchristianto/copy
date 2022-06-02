jQuery(document).ready(function($){
	"use strict";
	var overlayNav = $('.cd-overlay-nav'),
		overlayContent = $('.cd-overlay-content'),
		navigation = $('.cd-primary-nav'),
		toggleNav = $('.cd-nav-trigger'),
		cropperInstance,
		croppedSize,
		result,
		widthModifier = $('#width-modifier').width();

	//inizialize navigation and content layers
	layerInit();
	$(window).on('resize', function(){
		window.requestAnimationFrame(layerInit);
	});

	//open/close the menu and cover layers
	toggleNav.on('click', function(){
		if(!toggleNav.hasClass('close-nav')) {
			//it means navigation is not visible yet - open it and animate navigation layer
			toggleNav.addClass('close-nav');
			
			overlayNav.children('span').velocity({
				translateZ: 0,
				scaleX: 1,
				scaleY: 1,
			}, 500, 'easeInCubic', function(){
				navigation.addClass('fade-in');
			});
		} else {
			//navigation is open - close it and remove navigation layer
			toggleNav.removeClass('close-nav');
			
			overlayContent.children('span').velocity({
				translateZ: 0,
				scaleX: 1,
				scaleY: 1,
			}, 500, 'easeInCubic', function(){
				navigation.removeClass('fade-in');
				
				overlayNav.children('span').velocity({
					translateZ: 0,
					scaleX: 0,
					scaleY: 0,
				}, 0);
				
				overlayContent.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					overlayContent.children('span').velocity({
						translateZ: 0,
						scaleX: 0,
						scaleY: 0,
					}, 0, function(){overlayContent.removeClass('is-hidden')});
				});
				if($('html').hasClass('no-csstransitions')) {
					overlayContent.children('span').velocity({
						translateZ: 0,
						scaleX: 0,
						scaleY: 0,
					}, 0, function(){overlayContent.removeClass('is-hidden')});
				}
			});
		}
	});

	function layerInit(){
		var diameterValue = (Math.sqrt( Math.pow($(window).height(), 2) + Math.pow($(window).width(), 2))*2);
		overlayNav.children('span').velocity({
			scaleX: 0,
			scaleY: 0,
			translateZ: 0,
		}, 50).velocity({
			height : diameterValue+'px',
			width : diameterValue+'px',
			top : -(diameterValue/2)+'px',
			left : -(diameterValue/2)+'px',
		}, 0);

		overlayContent.children('span').velocity({
			scaleX: 0,
			scaleY: 0,
			translateZ: 0,
		}, 50).velocity({
			height : diameterValue+'px',
			width : diameterValue+'px',
			top : -(diameterValue/2)+'px',
			left : -(diameterValue/2)+'px',
		}, 0);
	}

	$('#image-field').on('change', function(event) {
		let target = event.target || window.event.target
		let files = target.files

		// FileReader support
		if (FileReader && files && files.length) {
			let fr = new FileReader()
			fr.onload = () => {
				const $canvas = $('#uploaded-img')
				$canvas.attr('src', fr.result)
				$canvas.cropper({
					crop: event => {
						croppedSize = {
							width: event.detail.width,
							height: event.detail.height
						}
						
						result = cropperInstance.getCroppedCanvas({
							fillColor: '#fff',
							imageSmoothingEnabled: true,
							imageSmoothingQuality: 'high',
							width: croppedSize.width,
							height: croppedSize.height,
							maxWidth: 4096,
							maxHeight: 4096,
						})
						$('#result').html(result)

						const dataUrl = result.toDataURL()
						for (let i = 1; i <= 8; i++) {
							$(`#print-col-${i}`).attr('src', dataUrl)
						}
					},
					minContainerHeight: 400,
					minContainerWidth: widthModifier,
					dragMode: 'crop',
				})

				cropperInstance = $canvas.data('cropper')
			}
			fr.readAsDataURL(files[0])
		} else {
			alert('Browser not supported')
		}
	})

	// $('#crop-btn').click(() => {
	// 	result = cropperInstance.getCroppedCanvas({
	// 		fillColor: '#fff',
	// 		imageSmoothingEnabled: true,
	// 		imageSmoothingQuality: 'high',
	// 		width: croppedSize.width,
	// 		height: croppedSize.height,
	// 		maxWidth: 4096,
	// 		maxHeight: 4096,
	// 	})
	// 	$('#result').html(result)
	// })

	$('#print').click(() => {
		$('#edit-page').addClass('d-none')
		$('#print-page').removeClass('d-none').addClass('d-block')
		window.print()
		location.reload()
	})
});