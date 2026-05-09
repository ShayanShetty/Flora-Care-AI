export interface DiseaseEntry {
  id: string;
  plantName: string;
  diseaseName: string;
  description: string;
  symptoms: string;
  treatment: string;
  prevention: string;
}

export const diseaseData: DiseaseEntry[] = [
  {
    id: "d1",
    plantName: "Tomato",
    diseaseName: "Early Blight",
    description: "Early blight is a common fungal disease caused by Alternaria solani that affects tomato plants, resulting in dark lesions on leaves and fruit.",
    symptoms: "Dark brown spots with concentric rings forming a 'bullseye' pattern on older leaves. Yellow halos may surround the spots. Leaves eventually yellow and drop.",
    treatment: "Apply fungicides containing chlorothalonil or copper-based compounds. Remove and destroy infected plant material. Ensure adequate spacing for air circulation.",
    prevention: "Use disease-resistant varieties. Avoid overhead irrigation. Rotate crops annually. Apply preventive fungicide sprays during warm, humid weather.",
  },
  {
    id: "d2",
    plantName: "Tomato",
    diseaseName: "Late Blight",
    description: "Late blight caused by Phytophthora infestans is a devastating disease that can rapidly destroy entire tomato crops under cool, moist conditions.",
    symptoms: "Water-soaked, pale green to dark brown patches on leaves. White fuzzy growth on undersides of leaves. Fruit develops firm, brown, leathery patches.",
    treatment: "Apply fungicides such as metalaxyl or mancozeb at first sign of disease. Destroy infected plants immediately. Do not compost affected plant material.",
    prevention: "Plant resistant varieties. Avoid overhead watering. Improve air circulation. Monitor weather conditions and apply preventive sprays before disease appears.",
  },
  {
    id: "d3",
    plantName: "Potato",
    diseaseName: "Black Scurf",
    description: "Black scurf is a fungal disease caused by Rhizoctonia solani that affects potato tubers, leaving dark, crusty patches on the skin surface.",
    symptoms: "Black or dark brown, irregular, crusty patches on potato skin. Stems may show dark brown cankers near the soil line. Misshapen tubers with cracked surfaces.",
    treatment: "Treat seed potatoes with fungicide before planting. Ensure proper soil drainage. Apply fungicide to soil at planting in heavily infested fields.",
    prevention: "Use certified seed potatoes. Practice crop rotation. Plant in well-drained soils. Harvest tubers promptly when mature.",
  },
  {
    id: "d4",
    plantName: "Apple",
    diseaseName: "Apple Scab",
    description: "Apple scab caused by Venturia inaequalis is one of the most serious diseases of apples, causing blemished fruit and defoliation in severe cases.",
    symptoms: "Olive-green to black velvety spots on leaves and fruit. Infected leaves curl and drop prematurely. Fruit develops scabby, corky lesions that may crack.",
    treatment: "Apply fungicides during the critical infection period in spring. Use captan, myclobutanil, or thiophanate-methyl. Remove fallen leaves and fruit.",
    prevention: "Plant scab-resistant apple varieties. Prune trees for better air circulation. Rake and destroy fallen leaves in autumn.",
  },
  {
    id: "d5",
    plantName: "Grape",
    diseaseName: "Powdery Mildew",
    description: "Powdery mildew caused by Erysiphe necator (formerly Uncinula necator) is a major fungal disease of grapes that can severely reduce yield and fruit quality.",
    symptoms: "White to gray powdery coating on leaves, shoots, and berries. Infected berries may crack and shrivel. Young leaves may curl and distort.",
    treatment: "Apply sulfur-based fungicides or systemic fungicides such as myclobutanil. Ensure thorough coverage of all plant surfaces. Repeat at 7-14 day intervals.",
    prevention: "Maintain good canopy management for air circulation. Avoid excessive nitrogen fertilization. Begin preventive sprays early in the season.",
  },
  {
    id: "d6",
    plantName: "Corn",
    diseaseName: "Northern Leaf Blight",
    description: "Northern leaf blight caused by Exserohilum turcicum is a foliar disease of corn that can significantly reduce yield in susceptible hybrids.",
    symptoms: "Long, tan to gray-green lesions on leaves, typically 1-6 inches long with wavy margins. Lesions have a cigar or canoe shape. Severe infection causes premature leaf death.",
    treatment: "Apply foliar fungicides at tasseling stage when disease is detected. Products containing strobilurins or triazoles are effective.",
    prevention: "Plant resistant hybrids. Practice crop rotation. Plow under infected residue. Avoid continuous corn planting.",
  },
  {
    id: "d7",
    plantName: "Rose",
    diseaseName: "Black Spot",
    description: "Black spot caused by Diplocarpon rosae is the most serious fungal disease of roses, causing significant defoliation and weakening of plants over time.",
    symptoms: "Circular black spots with fringed margins on upper leaf surfaces. Yellowing of surrounding leaf tissue. Premature leaf drop leaving bare canes.",
    treatment: "Apply fungicides containing myclobutanil, trifloxystrobin, or copper. Remove and destroy infected leaves. Avoid wetting foliage when watering.",
    prevention: "Plant disease-resistant rose varieties. Water at the base of plants. Improve air circulation through proper spacing and pruning. Clean up fallen leaves.",
  },
  {
    id: "d8",
    plantName: "Pepper",
    diseaseName: "Bacterial Leaf Spot",
    description: "Bacterial leaf spot caused by Xanthomonas campestris pv. vesicatoria is a destructive disease affecting peppers, particularly during warm, wet weather.",
    symptoms: "Small, water-soaked spots on leaves that turn brown with yellow halos. Spots may join together causing large necrotic areas. Defoliation and fruit spotting.",
    treatment: "Apply copper-based bactericides. Remove infected plant material. Avoid overhead irrigation. No effective curative treatments exist — focus on prevention.",
    prevention: "Use pathogen-free seed or transplants. Apply copper sprays preventively. Practice crop rotation. Avoid working in fields when plants are wet.",
  },
  {
    id: "d9",
    plantName: "Hibiscus",
    diseaseName: "Leaf Spot",
    description: "Leaf spot on hibiscus is caused by various fungal or bacterial pathogens including Cercospora and Phyllosticta species, leading to unsightly blemishes.",
    symptoms: "Circular to irregular spots on leaves, often with dark brown borders and lighter tan centers. Spots may merge causing large blighted areas and premature leaf drop.",
    treatment: "Apply copper-based fungicide or neem oil sprays. Remove heavily infected leaves. Ensure good drainage and air circulation around plants.",
    prevention: "Water at the base of plants, not overhead. Provide adequate spacing. Remove fallen infected leaves. Apply preventive copper sprays during humid weather.",
  },
  {
    id: "d10",
    plantName: "Strawberry",
    diseaseName: "Leaf Scorch",
    description: "Leaf scorch of strawberry caused by Diplocarpon earlianum creates a burned appearance on foliage and significantly reduces plant vigor and yield.",
    symptoms: "Small, purplish-red spots on leaf surfaces. Spots enlarge and centers turn tan or gray. Severe infection causes entire leaves to look scorched or burned.",
    treatment: "Apply fungicides containing captan or thiram. Remove and destroy infected plant debris after harvest. Avoid excessive nitrogen applications.",
    prevention: "Plant resistant varieties. Use proper plant spacing. Renovate beds after harvest. Practice good sanitation by removing old leaves.",
  },
  {
    id: "d11",
    plantName: "Peach",
    diseaseName: "Brown Rot",
    description: "Brown rot caused by Monilinia fructicola is one of the most destructive diseases of stone fruits, capable of destroying entire crops near harvest.",
    symptoms: "Circular brown spots on fruit that expand rapidly. Concentric rings of gray spore masses develop on infected areas. Mummified fruit remains on trees.",
    treatment: "Apply fungicides containing captan, myclobutanil, or propiconazole. Begin sprays at petal fall and continue through harvest. Remove mummified fruit.",
    prevention: "Remove and destroy mummified fruit and infected twigs. Prune for good air circulation. Avoid injury to fruit. Apply preventive fungicide program.",
  },
  {
    id: "d12",
    plantName: "Soybean",
    diseaseName: "Frogeye Leaf Spot",
    description: "Frogeye leaf spot caused by Cercospora sojina is a common soybean disease that can cause significant yield losses in susceptible varieties during wet seasons.",
    symptoms: "Small, angular spots with reddish-brown to purple borders and gray centers. Spots resemble a frog's eye pattern. Severe infection leads to premature defoliation.",
    treatment: "Apply foliar fungicides containing azoxystrobin or pyraclostrobin if disease is severe. Economic thresholds must be considered before treatment.",
    prevention: "Plant resistant varieties. Practice crop rotation. Till infected residue. Avoid excessive plant populations that reduce air circulation.",
  },
];
