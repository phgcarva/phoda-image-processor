var showCompression = function () {
	var compression = document.querySelector('.compression-container')
	var imageContainer = document.querySelector('.filter-container')
	var histogramContainer = document.querySelector('.histogram-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"none"});
	Object.assign(document.querySelector('.enhancing-container').style,{display: "none"})
	Object.assign(document.querySelector('.convolution-container').style,{display:"none"});
	Object.assign(document.querySelector(".resize-container").style,{display:"none"});
	Object.assign(document.querySelector(".frequency-container").style,{display:"none"})
	Object.assign(document.querySelector(".adaptative-container").style,{display:"none"})
	Object.assign(document.querySelector('.color-model-container').style,{display:"none"})
	Object.assign(document.querySelector('.chroma-key-container').style,{display:"none"})
	Object.assign(document.querySelector('.shine-container').style,{display:"none"})
	Object.assign(document.querySelector('.haar-container').style,{display:"none"})
	Object.assign(document.querySelector('.compression-container').style,{display:"block"})
	Object.assign(document.querySelector('.morphological-container').style,{display:"none"})
	
	if (!histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.add('hidden')
		document.querySelector('.chart-div').classList.add('hidden')
	}

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
	}
	
	if(compression.classList.contains('hidden')){
		compression.classList.remove('hidden')
	}


}

var sortHuffmanFrequencies = function(channelsFrequencies){
	let sortedChannel = [];
	for(let i in channelsFrequencies)
		sortedChannel.push([channelsFrequencies[i],i]);

	sortedChannel.sort();
	return sortedChannel;
}

var computeHuffmanFrequencies = function(array){
	let channelsFrequencies = {};
	let sorted;
	for(let i = 0; i < array.length; i += 4){

		if(!(array[i] in channelsFrequencies)){
			channelsFrequencies[array[i]] = 1;
		}

		channelsFrequencies[array[i]]++;
	}

	sorted = sortHuffmanFrequencies(channelsFrequencies);

	return sorted;
}

var buildHuffmanTree = function(tuples){
    while(tuples.length > 1){
        let parent = [tuples[0][1],tuples[1][1]];
        let parentFreq = tuples[0][0] + tuples[1][0];

        let rest = tuples.slice(2,tuples.length);

        tuples = rest;
        end = [parentFreq,parent];
        tuples.push(end);
        tuples.sort();
    }
    return tuples[0][1];
}

var assignHuffmanCodes = function(codes, node, pat){
    pat = pat || "";

    if (typeof node == typeof ""){
        codes[node] = pat;
    }
    else{
        assignHuffmanCodes(codes,node[0],pat+"0");
        assignHuffmanCodes(codes,node[1],pat+"1");
    }
    
}

var encodeHuffman = function(codes, array, tree){
	let output="";

    for(let i in array)
        output = output + codes[array[i]];

	return [output, tree];
}

var Huffman = function (data){
	let freqs = computeHuffmanFrequencies(data),
		tree = buildHuffmanTree(freqs)	
		codes = {};

	assignHuffmanCodes(codes,tree);
	encoded = encodeHuffman(codes,data,tree);

	return encoded;
}

var decodeHuffman = function(tree,array){
	let output="",
		p = tree,
		bit;

    for (bit in array){
                
        if (array[bit] == 0){
            p = p[0];
        }
        else{
            p = p[1]
        }
        if (typeof p ==typeof ""){
            output = output + p
            p = tree
        }
    }
    return output
}


var saveBinary = function(rgb){

}

var readBinary = function(file){

}

var encodeRunlength = function(array){
    let result = '',
        zeros = 0,
        zerosTemp = '',
        wordLength = 0;

    for (i = 0; i < array.length; i ++) {
        if (array[i] === '0') 
            zeros += 1;
        
        else{
            zerosTemp = zeros.toString(2);
            wordLength = zerosTemp.length - 1;

            while (wordLength) {
                result = result + '1';
                wordLength -= 1;
            }
            
            result += '0' + zerosTemp;
            zeros = 0;
        }
    }
    return result;
}

var decodeRunLength = function(array){

}

var encodeLZW = function(data){
    let out = [],
    currChar,
    phrase = data[0].toString(),
    code = 256,
    i,
    dict = {};
    var j= 0;

    for (i = 1; i < data.length; i++) {
        currChar = data[i].toString();
        if (dict[phrase + "_" + currChar] != null) {
            phrase += "_" + currChar;            
        }
        else {
            out.push(phrase.split("_").length > 1 ? dict[phrase] : phrase);
            dict[phrase + "_" + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.split("_").length > 1 ? dict[phrase] : phrase);
    // console.log(out)
    return out;
}

var decodeLZW = function(data){
	var currChar = data[0].toString(),
        code = 256,
        code_dict = {};
        last = currChar;
        out = [currChar]

    for (let i=0; i<=255; i++) {
        code_dict[i.toString()] = i.toString()
    }

    for (let i = 1; i < data.length; i++) {
        let currChar = data[i].toString();

        var word = ''
        
        if (code_dict[currChar] != undefined) {
            for (var j=0; j<code_dict[currChar].split("_").length; j++)
                out.push(code_dict[currChar].split("_")[j]);
            word = code_dict[last] + "_" + firstChar(code_dict[currChar])
        }

        else {
            word = code_dict[last] + "_" + firstChar(code_dict[last]);
            for (var j=0; j<word.split("_").length; j++)
                out.push(word.split("_")[j]);
            
        }

        code_dict[code] = word;
        code++;
        last = currChar;
    }

    // console.log(out)

    return out;
}

var firstChar = function(str) {
    return str.split("_")[0]
}

var compress = function(){
	let imgData = genericFilter(),
		encoded = encodeLZW(imgData.data)
	
    var decoded = decodeLZW(encoded)

    console.log(imgData.data.length)
	console.log(encoded.length)
    console.log(decoded.length)

    for (var i = 0; i < imgData.data.length; i++) {
        // console.log(imgData.data[i] == decoded[i], imgData.data[i], decoded[i])
        imgData.data[i] = decoded[i]
    }

    document.querySelector(".canvas").getContext("2d").putImageData(imgData, 0, 0)
	// encoded = Huffman(encoded);
	// console.log(encoded[0].length)
	// let huffman_length = encoded[0][0].length + encoded[1][0].length + encoded[2][0].length;
	
	// console.log("Total Huffman length:",huffman_length);
	// let oR = encodeLZW(encoded[0][0],dict);
	// let oG = encodeLZW(encoded[1][0],dict);
	// let oB = encodeLZW(encoded[2][0],dict);
	// console.log("Total LZW length:", oR.length + oG.length + oB.length);

	// let dR = decodeLZW(oR);
	// decoded = decodeHuffman(encoded[0][1], dR);
	// console.log(decoded.length,encoded[0][0].length);
	var blob = new Blob([encoded],{type: "application/octet-stream"});
	var fileName = "encoded.phoda";
	saveAs(blob, fileName);
}

var decompress = function(){
	let files = document.getElementById("compressedImage").files;
	// tree,array = readBinary(file);
	// array = decodeRunLength(array);
	// let dataR = decodeHuffman(tree,array);
}