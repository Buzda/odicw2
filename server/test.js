// var dataString1 = "2005-12-13";
// var dataString2 = "2006-07-04";
// var dataString3 = "2011-05-24";

// console.log(dataString1);
// console.log(dataString2);
// console.log(dataString3);

// var dateType1 = new Date(dataString1);
// var dateType2 = new Date(dataString2);
// var dateType3 = new Date(dataString3);

// console.log(dateType1);
// console.log(dateType2);
// console.log(dateType3);

// if(dateType2>dateType1){
//     console.log('yes');
// }else{
//     console.log('no');
// }

// if(dateType2>dateType3){
//     console.log('yes');
// }else{
//     console.log('no');
// }

// var str = "2020-12-31T00:00:00.000Z";

// console.log(str.split("T")[0])

// var arrayString = "[{'name': 'Julien Mélade', 'institution/laboratory': 'Centre de Recherche et de Veille sur les Maladies Emergentes dans lOcéan Indien (CRVOI), Plateforme de Recherche CYROI', 'location': {'addrLine': '2 rue Maxime Rivière, 97490 Sainte Clotilde, La Réunion', 'country': 'France'}}, {'name': 'Nicolas 4#', 'institution/laboratory': 'University of Leipzig', 'location': {'addrLine': 'Augustusplatz 10', 'postCode': 'D-04109', 'settlement': 'Leipzig', 'country': 'Germany'}}, {'name': 'Beza Ramazindrazana', 'institution/laboratory': 'Centre de Recherche et de Veille sur les Maladies Emergentes dans lOcéan Indien (CRVOI), Plateforme de Recherche CYROI', 'location': {'addrLine': '2 rue Maxime Rivière, 97490 Sainte Clotilde, La Réunion', 'country': 'France'}}, {'name': 'Olivier Flores', 'institution/laboratory': 'UMR C53 CIRAD, Peuplements Végétaux et Bioagresseurs en Milieu Tropical', 'location': {'addrLine': '7 chemin de lIRAT', 'postCode': '97410', 'settlement': 'St Pierre', 'country': 'France'}}, {'name': 'Erwan Lagadec', 'institution/laboratory': 'Centre de Recherche et de Veille sur les Maladies Emergentes dans lOcéan Indien (CRVOI), Plateforme de Recherche CYROI', 'location': {'addrLine': '2 rue Maxime Rivière, 97490 Sainte Clotilde, La Réunion', 'country': 'France'}}, {'name': 'Yann Gomard', 'institution/laboratory': 'Centre de Recherche et de Veille sur les Maladies Emergentes dans lOcéan Indien (CRVOI), Plateforme de Recherche CYROI', 'location': {'addrLine': '2 rue Maxime Rivière, 97490 Sainte Clotilde, La Réunion', 'country': 'France'}}, {'name': 'Koussay Dellagi', 'institution/laboratory': 'Centre de Recherche et de Veille sur les Maladies Emergentes dans lOcéan Indien (CRVOI), Plateforme de Recherche CYROI', 'location': {'addrLine': '2 rue Maxime Rivière, 97490 Sainte Clotilde, La Réunion', 'country': 'France'}}, {'name': 'Hervé Pascalis', 'institution/laboratory': 'Centre de Recherche et de Veille sur les Maladies Emergentes dans lOcéan Indien (CRVOI), Plateforme de Recherche CYROI', 'location': {'addrLine': '2 rue Maxime Rivière, 97490 Sainte Clotilde, La Réunion', 'country': 'France'}}]";
// arrayString = JSON.parse(arrayString.replace(/'/g, '"'))
// // arrayString = JSON.stringify(arrayString)
// // console.log(typeof(arrayString))
// console.log(arrayString)

// var arr = [{'name': 'Ruwaida Abdo'}, {'name': 'Najlaa Saadi'}];
// // console.log(typeof(arr))
// arr = JSON.stringify(arr)
// console.log(typeof(arr))
// console.log(typeof(JSON.parse(arr)))

// var string = "0,1";
// var array = JSON.parse("[" + string + "]");

// console.log(typeof(array))

//  var related =  {
//     "related_1": "e50c8a016885a30fcf67cee1b1e70c56b5c27e2a",
//     "related_2": "bd9937d46e1e7947e28497ca098b76703981d2d9",
//     "related_3": "2975cca0a160177ac01195442ee8f6a55c59bd24",
//     "related_4": "1c02f14de3ae4c5e26600b073ec6396caefb3830",
//     "related_5": "135f5ee5fba1a4280521d45e4fa882354f63e691"
// }

// Object.keys(related).forEach(function(paper){
//     console.log(paper);
// });

var str = null;
console.log(str.split(":")[0])