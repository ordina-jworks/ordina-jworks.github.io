---
layout: post
authors: [peter_dekinder]
title: 'Out With The Old, In With The New'
image: /img/2021-02-17-Out-With-The-Old/logansrun.png
tags: [architecture, software architecture, business architecture, technical leadership]
category: Architecture
comments: true
---

Almost fifty years ago, the movie “Logan’s Run” introduced the phrase “Out with the old, in with the new” into pop culture vernacular. 
The story depicted a dystopian world where all needs where met by advanced technology, but due to scarcity of resources the population was kept under control by forced termination of the citizens of this society at the age of 30. 
If we were to flip this around on technology, we could conclude that in order to keep our business landscape manageable we need to address the lifespan of the assets in this landscape.

In every organization there is only a finite amount of budget and capacity for changing the way things are done. 
Especially in the IT domain, the balancing efforts between the operational resources (keeping the lights on) and those resources that can be allocated to new developments is a delicate exercise that the departments responsible for these expenditures have to go through on a recurring basis. 
Together with other parameters they determine the nature of the initiatives that happen by and for these departments.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-02-17-Out-With-The-Old/itparameters.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

Oftentimes we see that the operational budget far outweighs the budget that can be allocated to these new developments. 
This is normal as the need for business continuity reigns supreme in most organizations. 
This is why it is important to keep technical debt under control. 
[In a past thought](https://evolute.be/thoughts/disruption.html){:target="_blank" rel="noopener noreferrer"} I pointed out the dangers of technical debt that could lead to disruption by neglect. 
But within the space of the new developments budget there dwells an even more esoteric beast. 
This beast is called innovation. 
All too often Peter Drucker’s mantra “Innovate or Die” resounds in the hallowed halls of upper management, but to see it in practice is a different matter.

It is the job of the architect tasked with innovation to determine a framework consisting of processes and tools to support the various stakeholders (either individuals and/or teams) that are working within this context. 
Depending on the level at which the architect can steer innovation initiatives, any number of mechanisms can be devised. 
The framework you create should be aligned with the particularities of those stakeholders, and as such an understanding of their motivations and skillsets forms its foundation.

As with any major initiative one of the success factors is management sponsorship. 
In order to properly tackle innovation from a leadership perspective, the manager must first determine the type of leader best suits the needs. 
The primary focus of a manager concerned with innovation is to weigh the freedom to pursue innovation (or fostering the creativity of talent) versus establishing the internal controls needed to keep the innovation process grounded and avoid chaos. 
Taking note of the research done in 2019 by Deborah Ancona and Kate Isaacs, both researchers at the MIT Sloan School of Management, most innovative or “nimble” leaders can be categorized as one of these categories:
* Entrepreneurial Leaders: Usually located in lower levels of management. They are in charge of creating new products and/or services and as a collective they can influence the direction the organization is taking and as such also take the organization into new areas. The innovation bubbles up from bottom to top. A famous example of this type of leader is Steve Jobs at Apple when he was in charge of the new designs. 
* Enabling Leaders: Mostly occupying the middle tier of management, these leaders enable innovation by facilitating the entrepreneurial leaders in their organization. This can be done through ensuring budget, resources, and information or meeting other demands needed for the entrepreneurial leader to effect the innovation being pursued. They also tend to take on the role of mentor to make sure employees grow individually and that departments can navigate possible hardships on the horizon. Think of Patrick Lencioni, writer of the “[Five Dysfunctions of a Team](https://ordina-jworks.github.io/architecture/2020/07/08/Book-Five-Dysfunctions.html){:target="_blank" rel="noopener noreferrer"}”.
* Architecting Leaders: Usually found in the upper echelons of management, they have a helicopter view of the ecosystem their organization operates in, and a vision (big picture) on how to proceed in such a context. These leaders possess a keen insight into the various innovation initiatives per domain and start to play a role when this innovation necessitates changes on an organizational level (culture, strategy, structure). As such they create a set of blueprints allowing the other leaders to achieve their individual goals, and unifying these initiatives into what the organization and its customers need. A well-known example of this type of leader would be Jeff Bezos at Amazon.

These types bear more than a passing resemblance to the types of administrators identified by Robert Katz as he set out his Three-Skill Approach. 
Where the innovation types focus more on who the leaders are, Katz focuses more on dividing managerial types based on what skills they possess: technical skills (an understanding of certain activities, processes, and/or techniques), human skills (the ability to work with and motivate team members and other human assets), and conceptual skills (forming a vision of the organization as a whole and where it needs to go).

Managers do not operate in a vacuum. 
There is always the as-is organizational structure that forms boundaries of how far innovation can be taken, and innovation initiatives should align themselves to the corporate strategy. 
Where the architecting leaders set the blueprints, these constraints are distilled from the type of organization the management is a part of. 
A useful tool for determining how the organization should characterize its initiatives, and how it goes about achieving them is the [Innovation Matrix](https://www.boardofinnovation.com/tools/innovation-matrix/){:target="_blank" rel="noopener noreferrer"} from Board of Innovators. 
The innovation types proposed by the matrix are characterized by the willingness to invest and the focus for the innovation influx (either from external or internal sources):
* Hunters: Organizations that are willing to invest heavily in innovation, but seek to import innovative ideas into their existing portfolio though cooperation with startups, acquisitions, corporate ventures… This is the innovation approach of Google. Techniques to go about this are venture funds, structural partnerships, external accelerators, and co-development tracks.
* Builders: Organizations that are willing to invest heavily in innovation, but put their stock in their own capabilities to achieve this innovation, with significant resources (both budget and people) being poured into transforming their organization and even going so far as to create dedicated departments (also called centers of excellence and/or innovation labs). Famous amongst these types of innovators is Apple.
* Explorers: Explorer organizations are the low(er) investment counterpart of the hunters. Innovation experimentation in the form of hackatons or casual preliminary contacts with startups give an idea to the organization if and where they want to put their investments. These organizations recognize the need for innovation, but are not willing to go all-in. Orange has been adopting this style of innovation.
* Experimenters: These organizations try to organize their innovation around their own resources, but try to limit the effort they expend for these initiatives. They tend to focus on low-cost techniques such as innovation training and design sprints in order to mature their internal resources and build a solid innovation capability and mindset. Spotify and Netflix are the success stories in this type of innovation.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-02-17-Out-With-The-Old/innovationmatrix.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

##	Considerations for the Hunter Type

Deciding which merger or acquisition to go for might seem as arbitrary as betting on which innovation horse will win the race, but there are consequences to this approach. 
Clayton Christensen, father of the theory of disruptive innovation, pointed out that there are several valid reasons for joining two organizations (either by takeover or merger): either to improve current operations by boosting performance or reducing operational cost, and/or dramatically transform the organization’s growth prospects by reinventing the business model, and/or optimizing/diversifying the business portfolio.

In any case, the business models of the two organizations will need to be integrated on a number of facets:
* Customer Value Proposition: The services/products that customers value above the alternatives within the organization’s market segments.
* Profit Formula: The revenue model and cost structure in place to ensure the organization is able to deliver the customer value proposition and generate the revenues needed to sustain the organization.
* Organizational Resources: Any resources (employees, customers, products/services, infrastructure, cash flow…) that the organizations have to deliver the customer value proposition.
* Organizational Processes: Some domains (manufacturing, R&D, budgeting, sales…) will be easier to match than others depending how much the views of the two organizations in these domains differ.

This integration can happen in two distinct ways. 
The first way is called the Leverage-my-Business-Model acquisition (LBM). 
This is rather straightforward with all resources extracted from one of the organizations, and infused on the other one. 
This incurs the least risk and thus the least potential for returns. 
The current infrastructure of the master organization needs to be extended with the new components of the disappearing organization and it needs to scale its existing components to support the additional load. 
The second way is called the Reinvent-my-Business-Model (RBM). 
The business model of the acquired organization is used to revamp the existing business model of the master organization and create of fusion business model and infrastructure. 
This is a best-of-breed solution where each individual component of both organizations is considered for optimal use.

A consequence of having a steady stream of innovations assimilated into your organizational structure is the need for ways to quickly and as seamless as possible integrate the new components and value chains into your existing setup. 
On a solution architecture level this means providing the tools to achieve this with the least amount of hassle. 
This leads us to state that integration capabilities should receive fair amount of attention. 
Examples of such integration capabilities can be API Management, Enterprise Service Buses (ESB) or the Hybrid Integration Platform (HIP) that Gartner places as one of the necessary tools for any digital transformation. 

## Considerations for the Builder Type

Having to foster innovation from within can be a trickier than to just scrutinize the market and acquire what seems to be working. 
It requires either making sure that there are products/services in your organization’s portfolio that can be improved upon (sustaining technologies) or detecting disruptive technologies to create a completely new market to capitalize on. 
These disruptive technologies come with the burden of lower profit margins but higher profit potential as the market matures. 
To clarify: The term “disruptive technologies” is used here as sort of an umbrella term. 
In the [same reference article](https://evolute.be/thoughts/disruption.html){:target="_blank" rel="noopener noreferrer"} where I tackled technical debt I also discuss other numerous forms of disruption, each with their causes and effects on how the bottom line for an organization is achieved.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-02-17-Out-With-The-Old/disruptivetechassessment.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

One benefit over Hunter types is that if a working innovation (one that catches on in the market) is discovered within the organization, that organization has a first mover advantage, allowing the organization to establish brand recognition and customer loyalty before competitors are able to reproduce or approximate the innovative endeavor. 
It allows for setting yourself up as the benchmark and industry standard against which customers will judge copycat products and services.

Since disruptive technologies come in at a lower profit margin, partly due to higher costs associated with them, it is only natural to attempt to curb these costs by matching your infrastructure to the needs of the innovations. 
This requires digital transformation initiatives in order to support them. 
According to Oracle there are certain indispensable requirements for achieving success in such transformations:
* An executive mandate to implement transformations. The Architecting Leaders of the organization should be on board, and even sponsor and propel these transformations forward. The sponsorship and support could be handled by Enabling Leaders if they are backed by the Architecting leader.
* The focus of the transformation initiative should be fixed on the final result, and should not deviate from it course once begun.
* There needs to exist a sense of urgency to get the transformation done. Time is essential, and the longer the initiative lasts, the likelier it is that it will become irrelevant and superseded by another similar initiative.
* The initiative should not only care about modernizing customer touchpoints and enabling infrastructure, but also about the impact the transformation will have on the human factors of the equation. The change management aspect of the initiative dealing with employee experience and corporate culture is an important slice of the overall initiative.

Having decided that innovation comes from within means that the innovative teams need to have the proper tooling to support their efforts. 
Wanting to design new ideas and testing them out requires them to have a lot of sandbox capabilities at their disposal where they can quickly launch a Proof of Concept (POC) and ascertain whether or not to continue in the same vein or drop it to pursue other ideas. 
The faster the turnover of new ideas to quicker your innovations can be launched in the market and start paying off. 
A multitude of environments (typically in the form of a Cloud offering such as AWS or Azure) and the optimized CI/CD pipelines to get them up to date with your newest POCs makes this possible. 
Getting these POCs mature enough can be achieved through such approaches as for example the Design Thinking Process.

{:refdef: style="text-align: center;"}
<a href="https://dschool.stanford.edu/resources/getting-started-with-design-thinking" target="_blank"><img src="{{ '/img/2021-02-17-Out-With-The-Old/designthinking.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%"></a>
{: refdef}

## Considerations for the Experimenter Type

While not wanting to expend quite as much liquidity on innovation as the Hunter and Builder types, there are still some avenues that beckon for the Experimenter type. 
Hunters and Builders push heavily on innovation in order to attain the patronage of the high end market. 
When your product excels over all other similar products in the market, you can sell it at a higher markup as the customers in this segment have heavier purses. 
A higher markup equals higher profits. 
This does mean that there are two entire segments for whom the increased product excellence will not warrant the price they have to pay for it. 
Not everyone drives a Maserati. 
Some drive Audi, and others go for cars in an even lower price bracket. 

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-02-17-Out-With-The-Old/growthtrajectory.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

A valid strategy for Experimenter innovation is to aim for a just-enough innovation to keep up with the product leaders, but aiming for that mainstream market where profit margins are lower. 
In return your customer base is much larger to make up for this. 
It might seem that the same philosophy can be taken on the low end market. 
If not for the fact that this drop in profit margin and resulting increase in potential customer base does come with a warning: The lower in cost and product excellence you go on the spectrum, the easier it becomes for new competitors to enter it, and take a piece of the pie. 
This is what is known in Michael Porter’s Five Forces Model as the Threat of New Entrants, and is a vital consideration in evaluating whether you are adopted a viable business strategy. 

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-02-17-Out-With-The-Old/porter5forces.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
Taken from [EZY Education](https://www.ezyeducation.co.uk/ezybusinessdetails/ezybusiness-news/entry/business-studies-year-13-revision-day-6-porters-five-forces-model.html){:target="_blank" rel="noopener noreferrer"}
{: refdef}

This approach also allows for the emergence of a sleeper hit. 
These are innovations that the organization wasn’t actively or explicitly pursuing, but kind of crept up next to the main business model. 
This sleeper hit might even overtake the original business model, and replace it as the main source of revenue. 
A good example of this is Slack. 
When its organization developed the technology to support the development of their main product, an online game called Glitch, it was soon discovered that there was a greater market for this tool than for the game they were developing, and they decided to switch gears to pursue this sleeper hit.

Banking on innovation to emerge from within without structurally investing a lot of capital and resources, there needs to be fertile ground from which these innovations can spring. 
Since innovation seldom erupts from the thought and action of a single individual, the crux of the matter becomes getting like-minded people into contact with each other. 
Cross pollination between their views and ideas is what makes this innovation type possible. 
So the solutions that should be developed within such organizations are mostly collaborative and social engagement tools that allow for this cross pollination.

## Considerations for the Explorer Type

Organizations of the Explorer type opt not to engage in the innovation business on their own. 
To hedge their bets and spread the risk and cost of the innovation they engage with similar organizations to get traction. 
This can range from having co-creation sessions to incubators to simply scouting the market for talent that can further their objectives. 
As there are numerous obstacles that can be encountered on the road to innovative products, these organizations accept the shared benefits to reduce the impact these obstacles also called barriers will have on them. 

The obstacles can be grouped into four overall categories:
* Financial Barriers: R&D can be a costly affair, and can be too much for your organization zo bear alone. So to be able to divide costs of innovation, even resulting in a split profit could be preferable over not pursuing innovation, and sticking with sustaining your products for the foreseeable future.
* Unpredictable Success: Success of innovative products is hard to predict. This could complicate finding willing business sponsors or investors from outside the organization. The return on investment (ROI) has been a mainstay in building business cases, and it is almost impossible to calculate for innovation. Thus, spreading the cost and risks through sharing the effort can help in this department.
* Missing Marketing Skills: Producing a viable innovative product is one thing. Being able to convince your customers that they need it is another. The marketing team that will help your product become the new need-to-have product should have the same innovative mindset as your innovation team. Seeking these marketing skills outside your organization might be just what the doctor ordered.   
* Management Barriers: Missing the innovation leaders within the organization can slow the progress made by the innovation initiatives. Looking for these innovation managers in an organization that is willing to cooperate can lessen the hurt with this barrier.

The main takeaway of these barriers is that there is a correlation between risk and success in the innovation game. 
The increased risk of innovation initiatives reflects on what can be achieved in the areas of improving your organization’s market position and competitiveness. 
Getting a firm understanding of which barriers your organization faces mitigates some of the risks in this type of endeavor.

Similar to the Experimenter type, these organizations depend heavily on emergent innovations. 
This necessitates the same focus on collaboration and social tooling, but with the added complication that this collaboration takes place across organizational boundaries. 
This adds an increased need for the proper security capabilities to make sure the interaction between participant organizations is limited to those organizations. 
It also means that the reputation of the organization in the fields of innovation becomes a currency that can buy the partnerships that are needed. 
This reputation is mostly constructed from the visibility of the human capital and talent your organization brings to the table, and can be positively influenced with getting your people out there, writing blog posts, giving key notes and networking as much as possible.

