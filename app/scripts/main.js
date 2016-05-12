var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    var onRenderFcts = [];
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 2;
    
    //iluminación
    var light3d = new THREE.AmbientLight(0x101010);
    light3d.name = 'Ambient light';
    scene.add(light3d);
    var light3d = new THREE.DirectionalLight('white', 0.255);
    light3d.position.set(2.6,-3,1);
	light3d.name	= 'Back light';
	scene.add(light3d);
	var light3d	= new THREE.DirectionalLight('white', 0.375);
	light3d.position.set(-2, 0, -1);
	light3d.name 	= 'Key light';
	scene.add(light3d);
	var light3d	= new THREE.DirectionalLight('white', 0.5*2);
	light3d.position.set(3, -5, 3);
	light3d.name	= 'Fill light';
	scene.add(light3d);
    
    //obj
	var geometry = new THREE.PlaneGeometry(1,1,10,10)
	var material = new THREE.MeshBasicMaterial( {
		wireframe : true
	})
	var mesh = new THREE.Mesh(geometry, material);
	scene.add( mesh );
	var mesh = new THREE.AxisHelper
	scene.add( mesh );
    
    addBar(0,6);
    
    function addBar(posX,height){
		var sizeBar = 0.2;
		var highestHeight = 8+2;
		var counter = 0;
		var geometry = new THREE.BoxGeometry( sizeBar, sizeBar, sizeBar );
		var material = new THREE.MeshPhongMaterial( { color:0x1054B5,reflectivity:1} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = posX;
		mesh.position.y = 0;
		mesh.position.z = 0;
		var myMatrix = new THREE.Matrix4().set(
			1,0,0,0,
			0,1,0,0,
			0,0,1,sizeBar/2,
			0,0,0,1
		);
		mesh.geometry.applyMatrix( myMatrix );
		scene.add( mesh );
		onRenderFcts.push(function(now, delta){
			counter += 0.1 * delta/80;
			if (counter<height) {
				mesh.scale.z =counter;
                //mesh.rotateX(counter);
			}
			if(counter>highestHeight){
				counter = 0
			}
		});
	}
    
    //render
    // handle window resize
	window.addEventListener('resize', function(){
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}, false);
	// set the scene as visible
	scene.visible	= false;
	// render the scene
	onRenderFcts.push(function(){
		renderer.render( scene, camera );
	});
	// run the rendering loop
	var previousTime = performance.now();
	requestAnimationFrame(function animate(now){
		requestAnimationFrame( animate );
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(now, now - previousTime);
		})
		previousTime = now;
	});
    
    // ar
    // init the marker recognition
	var jsArucoMarker	= new THREEx.JsArucoMarker()
	// init the image source grabbing
	var videoGrabbing = new THREEx.WebcamGrabbing()
	jsArucoMarker.videoScaleDown = 2
	// attach the videoGrabbing.domElement to the body
    document.body.appendChild(videoGrabbing.domElement)
	// process the image source with the marker recognition
	onRenderFcts.push(function(){
		var domElement	= videoGrabbing.domElement
		var markers	= jsArucoMarker.detectMarkers(domElement)
		var object3d = scene
		object3d.visible = false
		// see if this.markerId has been found
		markers.forEach(function(marker){
			// if( marker.id !== 265 )	return
			jsArucoMarker.markerToObject3D(marker, object3d)
			object3d.visible = true
		})
	});