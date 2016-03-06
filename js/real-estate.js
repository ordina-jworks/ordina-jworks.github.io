/* Real State JS  */

// GMAP JS

$('#my_map').gMap({
	address: "Rainham Marshes RSPB Nature Reserve, London",
	zoom: 13,
	markers:[
		{
			address: "Rainham Marshes RSPB Nature Reserve, London",
			html: "<h5>Charlie</h5><p>19 Kummy Street<br />Kanchepuram<br />Chennai - 625003</p>",
			popup: true
		}
	]
});

 $('#property_map').gMap({
	controls: false,
	zoom: 11,
	markers:[
		{
			latitude: 28.6100,
			longitude: 77.2300,
			html: "<h5>New Delhi</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Lotus Temple",
			html: "<h5>Lotus Temple</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Qutb Minar",
			html: "<h5>Qutb Minar</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "India Gate",
			html: "<h5>India Gate</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Rashtrapati Bhavan",
			html: "<h5>Rashtrapati Bhavan</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Indian Institute of Technology New Delhi",
			html: "<h5>IIT-DELHI</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Jawaharlal Nehru University New Delhi",
			html: "<h5>JNU-Delhi</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Laxmi Nagar",
			html: "<h5>Laxmi Nagar</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Patel Nagar",
			html: "<h5>Patel Nager</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Pratap Vihar",
			html: "<h5>Pratap Vihar</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Noida",
			html: "<h5>Noida</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "University of Delhi New Delhi",
			html: "<h5>UD</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		}
	]
});