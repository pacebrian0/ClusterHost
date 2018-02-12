/*
function automatedNoKMeansTests()	{
	var config = {
		method: "nkm",
		useTestData: true,
		includeTitle: true,
		includeURL: false,
		removeQueryTerms: true,
		removeStopWords: true,
		removeSymbols: true,
		removeNumbers: false,
		removeShortWords: false,
		removeSingleDocumentTerms: false,
		stemWords: true,
		showFeatures: false,
		showResults: true,
		showClusters: false,
		nkm: {threshold: 0.00}
	};
	var i = 0.00;
	while (i <= 1.00)	{
		config.nkm.threshold = i;
		console.log("----------");
		console.log("Threshold:", config.nkm.threshold);
		console.log("----------");
		performClustering(config);
		i += 0.01;
	}
}
*/

var config = {
    method: "nkm",
    useTestData: true,
    includeTitle: true,
    includeURL: false,
    removeQueryTerms: true,
    removeStopWords: true,
    removeSymbols: true,
    removeNumbers: false,
    removeShortWords: false,
    removeSingleDocumentTerms: false,
    stemWords: true,
    showFeatures: false,
    showResults: true,
    showClusters: false,
    nkm: {threshold: 0.00}
};

function clusterResultsUsingNoKMeans(results, threshold) {
    //console.log(threshold);
    var clusters = [];
    var similarities = [];
    var max_index = 0;
    results = order_results(results);
    for (var i = 0; i < results.length; i++) {
        similarities = [];
        if (clusters.length == 0) {
            clusters.push(new_cluster([results[i]], clusters.length, clone_object(results[i].data)));
        }
        else {
            for (var j = 0; j < clusters.length; j++) {
                similarities.push(calc_cosine_similarity(results[i].data, clusters[j].data));
            }
            max_index = maximum_similarity_index(similarities);
            //console.log("Similarities:")
            //console.log(similarities)
            //console.log("Index: "+max_index)
            if (similarities[max_index] >= threshold) {
                //console.log("Accepted");
                clusters[max_index].documents.push(results[i]);
                update(clusters[max_index]);
            }
            else {
                //console.log("Rejected");
                clusters.push(new_cluster([results[i]], clusters.length, clone_object(results[i].data)));
            }
        }
    }
    var singles_cluster = new_cluster([], 0, null);
    var i = 0;
    while (i < clusters.length) {
        if (clusters[i].documents.length == 1) {
            //console.log(i);
            singles_cluster.documents.push(clusters[i].documents[0]);
            clusters.splice(i, 1);
        }
        else {
            i++;
        }
    }
    if (singles_cluster.documents.length > 0) {
        clusters.push(singles_cluster);
        index(clusters);
    }
    return clusters;
}

function calc_cosine_similarity(frequency_list1, frequency_list2) {
    //Dot Product
    var dot_product = 0;
    for (var frequency in frequency_list1) {
        dot_product = dot_product + (frequency_list1[frequency] * frequency_list2[frequency]);
    }
    //Scalar Product
    var scalar1 = 0;
    var scalar2 = 0;
    var scalar_product = 0;
    for (var frequency in frequency_list1) {
        scalar1 = scalar1 + Math.pow(frequency_list1[frequency], 2);
        scalar2 = scalar2 + Math.pow(frequency_list2[frequency], 2);
    }
    scalar_product = Math.sqrt(scalar1) * Math.sqrt(scalar2);
    //Cosine Similarity
    var cosine_similarity = dot_product / scalar_product;

    return cosine_similarity;
}

function new_cluster(document_list, cluster_id, word_list) {
    var cluster = {
        documents: document_list,
        id: cluster_id,
        data: word_list
    };
    return cluster;
}

function maximum_similarity_index(similarities) {
    var maximum = similarities[0];
    var maximum_index = 0;
    for (var j = 0; j < similarities.length; j++) {
        if (similarities[j] > maximum) {
            maximum = similarities[j];
            maximum_index = j;
        }
    }
    return maximum_index;
}

function update(cluster) {
    //console.log(cluster);
    var average_term_frequency = 0;
    for (var frequency in cluster.data) {
        average_term_frequency = 0;
        for (var i = 0; i < cluster.documents.length; i++) {
            average_term_frequency = average_term_frequency + cluster.documents[i].data[frequency];
        }
        average_term_frequency = average_term_frequency / cluster.documents.length;
        cluster.data[frequency] = average_term_frequency;
    }
    //for (var frequency in cluster.data)
    //{
    //	cluster.data[frequency] = (cluster.data[frequency] + document.data[frequency])/2;
    //}
}

function clone_object(obj) {
    var temp = {};

    for (var frequency in obj) {
        temp[frequency] = obj[frequency];
    }
    return temp;
}

function index(clusters) {
    for (var i = 0; i < clusters.length; i++) {
        clusters[i].id = i;
    }
}

//Performs clustering of the results on the Google page according to the configuration provided
function performClustering(clusteringConfig) {
    if (clusteringConfig.useTestData) {
        var str = "subTopicID\tresultID\n";
        console.log(str);
        var iteration = 1;
        //testDataSubjects.forEach(function (subject) {
        for (var i = 0; i < testDataSubjects.length; i++) {
            var subject = testDataSubjects[i];
            //console.log(subject);
            //console.log("Clustering results using ", clusteringConfig.method);
            var fileName = subject + ".n.xml";
            //Add the query (filename) to the config for easy access
            clusteringConfig.testDataQuery = subject;
            var results = getSearchResults(clusteringConfig, fileName);
            //csvHelper(results);

            if (results.length > 0) {
                var clusters = getClusters(results, clusteringConfig);
                clusterGoogleResults(clusters, clusteringConfig, iteration);
            }

            if (clusteringConfig.showClusters) {
                console.log(clusters);
            }

            //console.log("Results clustered.");
            iteration++;
        }
    } else {
        //console.log("Clustering results using ", clusteringConfig.method);

        var results = getSearchResults(clusteringConfig, null);

        if (results.length > 0) {
            //Log start time
            var start = new Date().getTime();
            //Start clustering
            var clusters = getClusters(results, clusteringConfig);
            //Log end time
            var end = new Date().getTime();
            //Result
            clusteringConfig.timeTaken = end - start;
            clusterGoogleResults(clusters, clusteringConfig, 0);
        }

        if (clusteringConfig.showClusters) {
            console.log(clusters);
        }
        //console.log("Results clustered.");
    }
}

//Clusters the results using the method specified in the configuration and returns a list of clusters (each with a list of documents and their HTML)
function getClusters(results, config) {
    // Automatically cluster results using SOM and display clusters in the Google Results page
    return clusterResultsUsingNoKMeans(results, config.nkm.threshold);

}

//Returns a list of search results including Title, URL, Content, HTML, and Terms Vector
function getSearchResults(config, fileName, iteration) {
    var useTestData = config.useTestData;
    var includeTitleInList = config.includeTitle;
    var includeURLInList = config.includeURL;
    var removeQueryTerms = config.removeQueryTerms;
    var removeStopWords = config.removeStopWords;
    var removeSymbols = config.removeSymbols;
    var removeNumbers = config.removeNumbers;
    var stemWords = config.stemWords;
    var removeShortWords = config.removeShortWords;
    var removeSingleDocumentTerms = config.removeSingleDocumentTerms;
    var queryNumber = iteration;

    //Splits string by " " and stores it in an object
    var processString = function (toProcess) {
        //Split the string andd store the result in an array of individual words
        var words = toProcess.split(" ");
        var queryTerms = "";
        if (useTestData) {
            queryTerms = config.testDataQuery.split("_");
        } else {
            queryTerms = getQuery().split(" ");
        }

        //Go through each word and add it to an object as a new
        //attribute initialising its frequency to 0
        for (var i = 0; i < words.length; i++) {
            if (words[i] != "") {
                if (removeQueryTerms) {
                    //Check if the current word is a query term then define it
                    if (queryTerms.indexOf(words[i]) < 0) {
                        //If it was not defined, define it
                        if (typeof wordsBlankVector[words[i]] === 'undefined') {
                            wordsBlankVector[words[i]] = 0;
                        }
                    }
                } else {
                    //Just add it if it was not previously defined
                    if (typeof wordsBlankVector[words[i]] === 'undefined') {
                        wordsBlankVector[words[i]] = 0;
                    }
                }
            }
        }
    };

    //Remove the stopwords from a string
    var removeStopWordsStemm = function (toProcess) {
        //Get the query terms
        var queryTerms = "";
        if (useTestData) {
            queryTerms = config.testDataQuery.split("_");
        } else {
            queryTerms = getQuery().split(" ");
        }
        //Stem query terms
        if (stemWords) {
            for (var i = 0; i < queryTerms.length; i++) {
                queryTerms[i] = stemmer(queryTerms[i]);
            }
        }

        //Split the string into individual words
        var words = toProcess.split(" ");

        //Stores the final result
        var result = "";

        //Go through each word and check if it is a stop word
        for (var i = 0; i < words.length; i++) {
            //Remove any leading or trailing whiteSpace
            words[i] = words[i].trim();
            //Stemm the word
            if (stemWords) {
                words[i] = stemmer(words[i]);
            }
            //Check query terms again after stemming
            if (removeQueryTerms) {
                if (queryTerms.indexOf(words[i]) >= 0) {
                    continue;
                }
            }

            if (removeStopWords) {
                //If it is not a stop word concat it with the result
                if (stopwords.indexOf(words[i]) < 0 && stemmedStopWords.indexOf(words[i]) < 0) {
                    if (removeShortWords) {
                        if (words[i].length >= 3) {
                            result += words[i] + " ";
                        }
                    } else {
                        result += words[i] + " ";
                    }
                }
            } else {
                if (removeShortWords) {
                    if (words[i].length >= 3) {
                        result += words[i] + " ";
                    }
                } else {
                    result += words[i] + " ";
                }
            }
        }
        return result;
    };

    //Get reference for stemmed words to recover original words
    var getWordReference = function (originalReference, str) {
        var words = str.split(' ');
        var result = originalReference;

        for (var word in words) {
            if (!removeStopWords || stopwords.indexOf(words[word]) < 0) {
                var stemmed = stemmer(words[word]);
                if (!result[stemmed]) {
                    result[stemmed] = words[word];
                }
            }
        }
        return result;
    };

    //Get results
    var allresults;

    if (useTestData) {
        //Get the results from the xml
        //var query = getQuery();
        var query = fileName;
        //console.log("Use test data checked");
        //console.log("Getting test data for: " + query);

        allresults = getTestDataResults(query);
    } else {
        allresults = document.getElementsByClassName("g");
        //console.log(allresults[2]);
    }

    var results = Array();
    // Remove results which have more than one class (i.e. videos, cards, etc.)
    for (var i = allresults.length - 1; i >= 0; i--) {
        if (allresults[i].className == 'g') {
            if (allresults[i].id != "imagebox_bigimages") {
                results.push(allresults[i]);
            }
        }
    }

    results.reverse();

    //Array to store each result object
    var resultObjects = Array(); //Title String (Original and Stemmed), Content String, URL String (Original and Stemmed), Data Object with words and frequencies, and HTML
    //List of words
    var wordsBlankVector = {}; //Filled using process string function

    //For each result create a result object and store the title, content and url
    for (var i = 0; i < results.length; i++) {
        //Create result Object
        try {
            //Create a new result object
            var result = {id: i, html: results[i], originalReference: {}};

            //Set the title, content and url
            //Get Title
            if (includeTitleInList) {
                //Convert it to lowercase
                var tmpTitle = getTitle(results[i]).toLowerCase();
                result.actualTitle = tmpTitle;

                //Remove symbols
                if (removeSymbols) {
                    tmpTitle = tmpTitle.replace(/[^a-zA-Z0-9\s]/g, " ");
                }
                //Remove Numbers
                if (removeNumbers) {
                    tmpTitle = tmpTitle.replace(/[\d+]/g, " ");
                }

                result.wordReference = getWordReference(result.originalReference, tmpTitle);

                //Remove stop words and stemm title
                if (removeStopWords || stemWords) {
                    tmpTitle = removeStopWordsStemm(tmpTitle);
                }
                result.title = tmpTitle;
            } else {
                //If title is not included in list just get the title as it is
                result.title = getTitle(results[i]);
            }

            //Get Url
            if (includeURLInList) {
                //Convert it to lowercase
                var tmpUrl = getURL(results[i]).toLowerCase();
                result.actualUrl = tmpUrl;

                //Remove symbols
                if (removeSymbols) {
                    tmpUrl = tmpUrl.replace(/[^a-zA-Z0-9\s]/g, " ");
                }
                //Remove Numbers
                if (removeNumbers) {
                    tmpUrl = tmpUrl.replace(/[\d+]/g, " ");
                }

                result.wordReference = getWordReference(result.originalReference, tmpUrl);

                //Remove stop words and stemm title
                if (removeStopWords || stemWords) {
                    tmpUrl = removeStopWordsStemm(tmpUrl);
                }
                result.url = tmpUrl;
            } else {
                //If title is not included in list just get the title as it is
                result.url = getURL(results[i]);
            }

            //Get Content
            //Sometimes results dont have content
            try {
                //Convert it to lowercase
                var tmpContent = getContent(results[i]).toLowerCase();

                var dateString = tmpContent.substr(0, 12);
                var date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    //tmpContent = tmpContent.substr(12, tmpContent.length);
                }

                //Remove symbols
                if (removeSymbols) {
                    tmpContent = tmpContent.replace(/[^a-zA-Z0-9\s]/g, " ");
                }
                //Remove Numbers
                if (removeNumbers) {
                    tmpContent = tmpContent.replace(/[\d+]/g, " ");
                }

                result.wordReference = getWordReference(result.originalReference, tmpContent);

                //Remove stopWords and stemm content
                if (removeStopWords || stemWords) {
                    tmpContent = removeStopWordsStemm(tmpContent);
                }
                result.content = tmpContent;
            } catch (err2) {
                result.content = "";
            }

            //Get individual words and store them in an object
            if (includeTitleInList) {
                processString(result.title);
            }

            if (includeURLInList) {
                processString(result.url);
            }

            processString(result.content);

            //Store result object
            resultObjects[resultObjects.length] = result;
        } catch (err) {
            //result image/video/news
            console.log(err);
            console.log(results[i]);
        }
    }

    var wordsHistogram = JSON.parse(JSON.stringify(wordsBlankVector));

    //Go through all the results again
    for (var i = 0; i < resultObjects.length; i++) {
        //Create an object using the list of words created earlier
        var wordsVector = JSON.parse(JSON.stringify(wordsBlankVector));
        if (includeTitleInList) {
            var titleArr = resultObjects[i].title.split(" ");

            for (var j = 0; j < titleArr.length; j++) {
                if (titleArr[j] != "") {
                    wordsVector[titleArr[j]]++;
                }
            }
        }

        //If include url option is enabled go through the url terms and increment the frequency of each word
        if (includeURLInList) {
            var urlArr = resultObjects[i].url.split(" ");

            for (var j = 0; j < urlArr.length; j++) {
                if (urlArr[j] != "") {
                    wordsVector[urlArr[j]]++;
                }
            }
        }

        //Go through each content words and increment the frequency of each word
        var contentArr = resultObjects[i].content.split(" ");

        for (var j = 0; j < contentArr.length; j++) {
            if (contentArr[j] != "") {
                wordsVector[contentArr[j]]++;
            }
        }

        //Add the vector to the result object
        resultObjects[i].data = wordsVector;
    }

    // Remove words which occur in only one document
    // Construct histogram
    if (removeSingleDocumentTerms) {
        for (var i = 0; i < resultObjects.length; i++) {
            for (var word in resultObjects[i].data) {
                if (resultObjects[i].data[word] > 0) {
                    wordsHistogram[word]++;
                }
            }
        }
        //console.log(wordsHistogram);
        // Remove from histogram those words which appear in only one document
        for (var word in wordsHistogram) {
            if (wordsHistogram[word] == 1) {
                delete wordsHistogram[word];
            }
        }
        // Remove words not found in the histogram from the result
        for (var i = 0; i < resultObjects.length; i++) {
            for (var word in resultObjects[i].data) {
                if (!wordsHistogram[word]) {
                    delete resultObjects[i].data[word];
                }
            }
        }
    }
    return resultObjects;
}

//Getters Get data from webpage
//Returns the query

function getQuery() {
    return document.getElementById("ires").getAttribute("data-async-context").substring(6).replace(/%20/g, " ");
}

//Returns the document title
function getTitle(result) {
    return result.getElementsByClassName("r")[0].innerText;
}

//Returns the document content
function getContent(result) {
    return result.getElementsByClassName("st")[0].innerText;
}

//Returns the document url
function getURL(result) {

    //return result.getElementsByClassName("_Rm")[0].innerText; //Returns url under title
    return result.getElementsByClassName("r")[0].getElementsByTagName('a')[0].href;
}

function setTitle(newTitle, result) {
    result.getElementsByTagName("a")[0].innerText = newTitle;
    //result.getElementsByClassName("r")[0].childNodes[0].childNodes[0].data = newTitle;
}

function setContent(newContent, result) {
    result.getElementsByClassName("st")[0].innerHTML = newContent;
}

//Clears the Google results section and fills it with clustered results
function clusterGoogleResults(clusters, config, queryNumber) {
    //Returns the HTML code for a cluster
    function getClusterHtml(cluster) {

        var clusterNode = document.createElement("div");

        var clusterFeatures = extractClusterFeatures(cluster);

        var clusterHeading = document.createElement("div");
        clusterHeading.style.cssText = "margin-bottom:10px;border-radius:5px;padding:3px;";

        var moreLikeThisQuery = getMoreLikeThisQuery(clusterFeatures);
        //var originalQuery = encodeURIComponent(getQuery());
        var originalQuery = getOriginalQuery();

        var findSimilarDiv = document.createElement("div");
        findSimilarDiv.style.cssText = "text-align:left;display:inline-block;width:80%;font-weight:bold;";

        var findSimilar = document.createElement("a");
        findSimilar.innerHTML = "Similar: " + moreLikeThisQuery;
        findSimilar.href = location.href.replace("q=" + originalQuery, "q=" + encodeURIComponent(moreLikeThisQuery));

        var showHideClusterDiv = document.createElement("div");
        showHideClusterDiv.style.cssText = "text-align:right;display:inline-block;width:20%;";

        findSimilarDiv.appendChild(findSimilar);
        clusterHeading.appendChild(findSimilarDiv);

        if (cluster.documents.length > 1) {
            var showHideCluster = document.createElement("button");
            showHideCluster.innerHTML = "Expand Cluster";
            showHideCluster.style.cssText = "border-radius:5px;background-color:#eee;cursor:pointer;";
            showHideCluster.onclick = function () {
                var docs = clusterNode.getElementsByClassName("g");
                for (var doc in docs) {
                    docs[doc].hidden = !docs[doc].hidden;
                    if (docs[doc].closestDocument) {
                        docs[doc].hidden = false;
                    }
                }
                if (showHideCluster.innerHTML == "Collapse Cluster") {
                    showHideCluster.innerHTML = "Expand Cluster";
                } else {
                    showHideCluster.innerHTML = "Collapse Cluster";
                }
            };
            showHideClusterDiv.appendChild(showHideCluster);
            clusterHeading.appendChild(showHideClusterDiv);
        }
        clusterNode.appendChild(clusterHeading);

        var closestDocFound = false;
        cluster.documents.forEach(function (doc) {
            var documentNode = doc.html;
            if (cluster.closestDocument) {
                documentNode.hidden = doc.id != cluster.closestDocument.id;
                documentNode.closestDocument = doc.id == cluster.closestDocument.id;
            } else {
                documentNode.closestDocument = !closestDocFound;
                closestDocFound = true;
                documentNode.hidden = !documentNode.closestDocument;
            }
            clusterNode.appendChild(documentNode);
        });

        if (showFeatures) {
            var featuresDiv = document.createElement("div");
            for (var feature in clusterFeatures) {
                var featureNode = document.createElement("p");
                featureNode.style.cssText = "display:inline-block;padding-right:20px;font-size:12px;";
                featureNode.innerHTML = feature + " - " + clusterFeatures[feature].word + ": " + clusterFeatures[feature].count;
                featuresDiv.appendChild(featureNode);
            }
            clusterNode.appendChild(featuresDiv);
        }

        var clusterBreak = document.createElement("hr");
        clusterNode.appendChild(clusterBreak);

        return clusterNode;
    }

    function getOriginalQuery() {
        var queryStart = location.href.indexOf("q=") + 2;
        var queryEnd = location.href.indexOf("&", queryStart) == -1 ? location.href.length : location.href.indexOf("&", queryStart);
        return location.href.substring(queryStart, queryEnd);
    }

    function getMoreLikeThisQuery(features) {
        var getBestFeature = function () {
            var bestFeature = {
                word: '',
                count: 1
            };

            for (var feature in features) {
                if (features[feature].count == bestFeature.count) {
                    bestFeature.word += " " + features[feature].word;
                }
                if (features[feature].count > bestFeature.count) {
                    bestFeature = features[feature];
                }
            }
            return bestFeature;
        };

        var addToQuery = getBestFeature().word;
        var query = getQuery();

        return query + " " + addToQuery;
    }

    function outputClustersInDatasetFormat(clusters) {
        var set = queryNumber;
        var str = "";
        for (var i = 0; i < clusters.length; i++) {
            clusters[i].documents.forEach(function (doc) {
                var j = doc.id + 1;
                var k = i + 1;
                str += set + "." + k + "\t" + set + "." + j + "\n";
            });
        }
        if (config.showResults) {
            console.log(str)
        }
    }

    var showFeatures = config.showFeatures;
    var resultsDiv = document.getElementsByClassName("srg")[0];
    resultsDiv.innerHTML = "";

    for (var i = 0; i < clusters.length; i++) {
        resultsDiv.appendChild(getClusterHtml(clusters[i]));
    }
    var resultStatsDiv = document.getElementById("resultStats");
    var clusterStats = document.getElementById("clusterStats") || document.createElement("nobr");
    clusterStats.id = "clusterStats";
    clusterStats.innerHTML = "| Results clustered in " + clusters.length + " clusters (" + (config.timeTaken / 1000) + " seconds)";
    resultStatsDiv.appendChild(clusterStats);

    outputClustersInDatasetFormat(clusters);
}