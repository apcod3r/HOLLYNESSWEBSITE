"""
Seed initial website content: blog posts, FAQs, testimonials,
settings, services, team, industries, jobs, process steps.
Run once after seed_admin.py:
  cd hollyness-api && venv/bin/python seed_content.py
"""
from datetime import datetime, timezone, timedelta
from app.database import engine, Base, SessionLocal
from app.models.blog import BlogPost
from app.models.faq import FAQ
from app.models.testimonial import Testimonial
from app.models.setting import SiteSetting
from app.models.service import Service
from app.models.team_member import TeamMember
from app.models.industry import Industry
from app.models.job_opening import JobOpening
from app.models.process_step import ProcessStep
from app.schemas.blog import slugify

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Helpers ──────────────────────────────────────────────────────────────────

def ago(days: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days)

# ── Blog Posts ───────────────────────────────────────────────────────────────

POSTS = [
    {
        "title": "Understanding the Debt Recovery Process in Tanzania: A Guide for Creditors",
        "category": "Debt Recovery",
        "excerpt": "Many creditors in Tanzania are unaware of the legal tools available to recover outstanding debts. This guide walks through the step-by-step process — from demand notices to court execution — and what to expect at each stage.",
        "content": """Recovering a debt in Tanzania involves a structured legal process that, when followed correctly, gives creditors the best chance of full recovery. Many creditors mistakenly believe that once a debtor stops communicating, the debt is unrecoverable. This is rarely true.

The process begins with a formal demand notice. This written notice states the outstanding amount, the deadline for payment and the consequences of non-payment. A well-drafted demand notice often prompts payment without any further action — many debtors simply need a firm, official reminder.

If the demand notice is ignored, the next step is negotiation and structured settlement. A professional debt recovery agent can facilitate this, proposing payment plans that are acceptable to both parties. This approach recovers money faster than litigation in most cases and preserves the business relationship where possible.

Where amicable settlement fails, legal action becomes necessary. This involves filing a claim in the appropriate Tanzanian court — the Resident Magistrate's Court for smaller claims and the High Court for larger ones. Once a judgment is obtained, our certified court brokers can execute it by attaching and auctioning the debtor's assets.

Understanding each stage helps creditors set realistic expectations and make informed decisions about when to escalate. Hollyness & Respishers guides clients through every step, providing transparent updates and professional advocacy throughout.""",
        "read_time": "6 min read",
        "is_featured": True,
        "days_ago": 24,
    },
    {
        "title": "Key Changes to Tanzania's Debt Collection Regulations: What Businesses Need to Know",
        "category": "Legal Updates",
        "excerpt": "Recent regulatory updates affect how debt collection agents operate in Tanzania. We break down the key changes, what they mean for creditors and how licensed commission agents must adapt their practices.",
        "content": """Tanzania's regulatory environment for debt collection has evolved significantly in recent years. Licensed commission agents are now subject to stricter oversight, and businesses that outsource their debt recovery must ensure they work with fully compliant partners.

The most significant change involves enhanced disclosure requirements. Debt collection agents must now provide debtors with a clear written statement of the debt, its origin and the debtor's rights before any recovery action is taken. This protects consumers while ensuring the process remains transparent.

Licensing requirements have also been tightened. Only agents holding a current Auctioneer License and registered with the relevant regulatory authority may legally collect debts on behalf of third parties. Businesses found using unlicensed collectors face significant penalties.

For creditors, these changes mean due diligence is more important than ever. Before engaging a debt recovery firm, verify their license number, check their regulatory status and review their compliance procedures. Hollyness & Respishers (Auctioneer License No. 000003633) maintains full compliance with all current regulations.

The changes ultimately benefit creditors who work with licensed professionals, as legally sound recovery processes are far less likely to be challenged or invalidated by debtors seeking technical grounds for avoidance.""",
        "read_time": "5 min read",
        "is_featured": True,
        "days_ago": 32,
    },
    {
        "title": "How Public Auctions Work in Tanzania: A Step-by-Step Overview",
        "category": "Auctioneering",
        "excerpt": "Public auctions are a powerful tool for recovering value from distressed assets. This article explains the legal framework, how assets are valued and marketed, and what buyers and sellers can expect on auction day.",
        "content": """Public auctions are an essential mechanism in Tanzania's debt recovery and asset disposal landscape. When a debtor cannot or will not pay, a properly conducted auction can realise significant value from their assets — often more than creditors expect.

The process begins with proper legal authority. An auctioneer can only sell assets under a court order, a writ of execution or a distress for rent warrant. Hollyness & Respishers, as licensed auctioneers, handle the legal documentation to ensure every sale is bulletproof.

Asset valuation follows authorisation. Our team conducts professional assessments of movable property (vehicles, equipment, furniture, stock) and immovable property (land, buildings). Accurate valuation protects creditors from underselling while setting a realistic reserve price.

Marketing is where many auctioneers cut corners — and where we distinguish ourselves. We advertise upcoming auctions through newspapers, social media, direct outreach to known buyers and our professional network, maximising attendance and competitive bidding.

On auction day, our auctioneers conduct a transparent, legally compliant sale. All bids are recorded, the highest bidder is declared, payment is collected and legal transfer documents are prepared. Proceeds are applied to the debt first, with any surplus returned to the debtor.

Post-auction reporting gives creditors a complete financial statement showing gross proceeds, deductions and net recovery. Full transparency at every step.""",
        "read_time": "7 min read",
        "is_featured": True,
        "days_ago": 44,
    },
    {
        "title": "Skip Tracing: How We Locate Debtors Who Have Relocated or Gone Silent",
        "category": "Debt Recovery",
        "excerpt": "One of the biggest challenges in debt recovery is finding debtors who have moved, changed phone numbers or become unresponsive. Our skip-tracing team uses a combination of legal databases, field investigations and professional networks.",
        "content": """A debtor who cannot be located cannot be compelled to pay. Skip tracing — the professional process of locating a missing person for legal purposes — is one of the most valuable tools in our recovery arsenal.

Our skip-tracing process begins with an analysis of all available information: last known address, employer details, vehicle registration, family contacts and any other data the creditor can provide. Even seemingly outdated information often yields useful leads.

We then cross-reference this against legal and commercial databases available to licensed agents. Business registration records, court records and property registries frequently reveal current addresses or employer details that debtors believe are hidden.

Field investigation is the next layer. Our investigators visit last known addresses, speak with neighbours and local contacts, and conduct discreet enquiries in the areas where the debtor was known to operate. Tanzania's communities are often closely networked, and professional field work yields results that database searches miss.

Professional networks round out the approach. Our relationships with other licensed agents, legal firms and financial institutions across Tanzania's five major cities mean that information on relocated debtors often surfaces through trusted channels.

Skip tracing is conducted strictly within the bounds of Tanzanian law. We do not engage in harassment, deception or any activity that could expose our clients to counter-claims. Our goal is location and legal engagement — nothing more.""",
        "read_time": "4 min read",
        "is_featured": False,
        "days_ago": 56,
    },
    {
        "title": "Non-Performing Loans in Tanzania: Trends, Causes and Recovery Strategies",
        "category": "Industry Insights",
        "excerpt": "Tanzania's banking and microfinance sectors continue to grapple with rising NPL ratios. We examine the root causes, which sectors are most affected, and the most effective strategies for reducing exposure and recovering value.",
        "content": """Non-performing loans remain one of the most significant challenges facing Tanzania's financial sector. With NPL ratios stubbornly elevated across commercial banks and microfinance institutions, understanding the underlying causes is essential to developing effective recovery strategies.

The primary drivers of NPL growth in Tanzania include over-optimistic credit assessment, inadequate collateral documentation and macroeconomic shocks affecting borrowers' ability to repay. Agricultural loans are particularly vulnerable to weather-related disruptions, while commercial loans suffer during periods of currency volatility.

Microfinance institutions face a unique challenge: their borrowers often lack formal credit histories, making assessment difficult, and their loan books are characterised by high volumes of small-value accounts — expensive to pursue individually through traditional legal channels.

The most effective recovery strategy depends on portfolio characteristics. For large commercial loans, structured negotiation backed by a credible legal threat is usually most effective. For micro-loan portfolios, batch processing — grouping similar accounts and applying standardised engagement protocols — delivers better economics.

Early intervention remains the single most impactful factor. Loans addressed within 90 days of default recover at significantly higher rates than those left to age. Creditors who establish clear escalation procedures and engage professional recovery agents early consistently outperform those who wait.

Hollyness & Respishers offers portfolio analysis, segmentation and customised recovery strategies for financial institutions managing NPL exposure. Contact us for a confidential assessment.""",
        "read_time": "8 min read",
        "is_featured": False,
        "days_ago": 69,
    },
    {
        "title": "Execution of Court Decrees in Tanzania: Rights, Procedures and Timelines",
        "category": "Legal Updates",
        "excerpt": "Winning a court case is only half the battle — enforcing the judgment is where many creditors struggle. This article outlines the legal procedures for executing court decrees in Tanzania and the role of certified court brokers.",
        "content": """Obtaining a court judgment against a debtor is a significant legal victory. But without proper enforcement, a judgment is merely a piece of paper. Execution — the legal process of compelling a judgment debtor to satisfy the decree — is where many creditors discover they need specialist help.

In Tanzania, execution of decrees is governed by the Civil Procedure Code. The process begins with an application to the court that issued the judgment, requesting a writ of execution. This writ authorises a court broker to take specific enforcement actions against the debtor's property.

The most common form of execution is attachment and sale of movable property. Under this process, the court broker (a role our certified officers hold) attends the debtor's premises, identifies and lists available assets, issues the required notices and — if payment is not made — proceeds to public auction.

Immovable property (land and buildings) can also be attached and sold, though this involves a more complex process including a property search, valuation and court approval of the sale terms. Timelines are longer but recovery amounts are typically higher.

Garnishee proceedings offer another avenue: where the debtor has funds held by a third party (such as a bank or an employer), the court can direct that third party to pay the creditor directly. This is often the fastest execution method when applicable.

Hollyness & Respishers holds certified court broker qualifications from the Law School of Tanzania. We manage the full execution process on behalf of creditors — from drafting the writ application to final settlement of proceeds.""",
        "read_time": "6 min read",
        "is_featured": False,
        "days_ago": 83,
    },
    {
        "title": "Distress for Rent: What Landlords in Tanzania Can and Cannot Do",
        "category": "Industry Insights",
        "excerpt": "Many landlords resort to self-help measures when tenants fall into arrears — which can expose them to legal liability. We clarify the lawful process for levying distress for rent and recovering rental arrears under Tanzanian law.",
        "content": """Rental arrears are a persistent problem for both residential and commercial landlords in Tanzania. Faced with non-paying tenants, many landlords are tempted to take matters into their own hands — changing locks, removing belongings or cutting utilities. These actions are illegal and expose landlords to serious counter-claims.

The lawful remedy for unpaid rent is distress for rent: a formal legal process that allows a landlord to seize and sell a tenant's goods to recover unpaid rent. This right is well-established under Tanzanian law but must be exercised strictly according to procedure.

The process requires proper notice to be served on the tenant before any seizure takes place. The notice specifies the amount outstanding, the basis of the claim and the deadline for payment. Many tenants pay at this stage, making further action unnecessary.

If payment is not received, a licensed auctioneer (such as Hollyness & Respishers) can attend the premises, create an inventory of seizable goods, and place them under seizure. The goods remain at the premises during a final opportunity period for the tenant to pay.

Where payment still does not occur, the seized goods are sold at public auction, with proceeds applied to the rental arrears and costs. Any surplus is returned to the tenant.

Critically, landlords cannot conduct this process themselves. Only licensed auctioneers have the authority to levy distress. Attempting to do so personally constitutes trespass and wrongful interference with goods — regardless of how much rent is owed.""",
        "read_time": "5 min read",
        "is_featured": False,
        "days_ago": 95,
    },
    {
        "title": "Hollyness & Respishers Expands Services to Arusha and Dodoma",
        "category": "Company News",
        "excerpt": "We are pleased to announce the expansion of our operational presence to Arusha and Dodoma, bringing our professional debt recovery and auctioneering services to clients in northern and central Tanzania.",
        "content": """Hollyness & Respishers Company Limited is proud to announce the expansion of our operational network to include dedicated service coverage in Arusha and Dodoma, complementing our existing offices in Mbeya, Dar es Salaam and Mwanza.

This expansion reflects both the growth of our client base and our commitment to providing truly nationwide debt recovery and auctioneering services. Many of our existing clients have debtors spread across Tanzania, and having local representatives in each major city significantly enhances our ability to act quickly and effectively.

Arusha, as a major commercial centre and the hub of East African trade, has a growing need for professional recovery services. Our Arusha team will serve clients in the northern corridor, working closely with the local business community and legal professionals.

Dodoma, as Tanzania's capital, hosts significant government and institutional activity. Our presence there enables us to serve public sector clients and financial institutions with operations in the central region more effectively.

Clients with outstanding portfolios that include debtors in northern or central Tanzania are encouraged to contact us to discuss how our expanded coverage can accelerate recovery. Our national footprint — now five cities — remains unique among Tanzanian commission agents.

We thank our clients and partners for their continued trust and look forward to delivering even better results across the country.""",
        "read_time": "3 min read",
        "is_featured": False,
        "days_ago": 105,
    },
    {
        "title": "Credit Risk Management: Preventing Bad Debts Before They Occur",
        "category": "Debt Recovery",
        "excerpt": "The best debt recovery strategy is one you never need to use. This guide covers practical credit risk management techniques for businesses in Tanzania — from customer screening to contract structuring.",
        "content": """Prevention is always more cost-effective than cure in debt management. While Hollyness & Respishers excels at recovering bad debts, we also advise clients on how to reduce the flow of new NPLs through better credit risk management practices.

The foundation is thorough customer screening before extending credit. This means verifying business registration details, checking for prior court judgments, requesting bank references and — where possible — reviewing recent financial statements. In Tanzania's SME sector, formal credit bureaus are not yet universal, making direct verification even more important.

Contract structuring is the second critical layer. Many bad debts arise not from debtor unwillingness but from poorly drafted agreements that create disputes about what is actually owed. Clear payment terms, defined milestones, late payment penalties and unambiguous default provisions all strengthen your position if recovery becomes necessary.

Collateral and guarantees significantly improve recovery prospects. A personal guarantee from a director, a charge over specific assets or a deposit against future services gives you concrete recourse if the primary debtor defaults. Ensure all security interests are properly documented and registered where required.

Early warning systems allow intervention before accounts deteriorate. Setting internal triggers — such as automatic follow-up at 7 days overdue and formal escalation at 30 days — means debtors hear from you while the relationship is still manageable and before the debt has become difficult to recover.

Finally, maintaining good client relationships paradoxically helps with collections. Clients who value your relationship are more likely to prioritise your invoice when cash is tight. Regular communication, excellent service delivery and fair dispute resolution all contribute to a stronger collections environment.""",
        "read_time": "7 min read",
        "is_featured": False,
        "days_ago": 119,
    },
]

post_count = 0
for p in POSTS:
    slug = slugify(p["title"])
    if db.query(BlogPost).filter(BlogPost.slug == slug).first():
        print(f"  skip (exists): {slug}")
        continue
    pub_at = ago(p["days_ago"])
    post = BlogPost(
        title=p["title"],
        slug=slug,
        category=p["category"],
        excerpt=p["excerpt"],
        content=p["content"],
        read_time=p["read_time"],
        is_published=True,
        is_featured=p["is_featured"],
        published_at=pub_at,
    )
    db.add(post)
    post_count += 1

db.commit()
print(f"Blog posts inserted: {post_count}")

# ── FAQs ─────────────────────────────────────────────────────────────────────

FAQS = [
    # General
    {"category": "General", "sort_order": 1,
     "question": "What is Hollyness & Respishers Company Limited?",
     "answer": "Hollyness & Respishers Company Limited is a fully licensed commission agent incorporated in Tanzania on 5th February 2021. We provide professional debt collection, public auctioneering, execution of court orders, distress for rent and general brokerage services to individuals, businesses and institutions across Tanzania."},
    {"category": "General", "sort_order": 2,
     "question": "Where are your offices located?",
     "answer": "Our head office is in Mbeya (Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741). We also have branch offices in Dar es Salaam, Arusha, Dodoma and Mwanza — giving us full nationwide coverage."},
    {"category": "General", "sort_order": 3,
     "question": "Are you licensed and regulated?",
     "answer": "Yes. We hold an Auctioneer License (No. 000003633) and are registered with the relevant regulatory authorities in Tanzania. Our legal officers hold certified competency in court brokerage and process serving from the Law School of Tanzania (2023)."},
    {"category": "General", "sort_order": 4,
     "question": "How do I contact your team?",
     "answer": "You can reach us by phone at +255 762 058 614, via WhatsApp at the same number, or by email at Office@hollyrespishers.com. You can also use the contact form on our website and we will respond within 24 hours on business days."},
    # Debt Recovery
    {"category": "Debt Recovery", "sort_order": 1,
     "question": "What types of debts do you recover?",
     "answer": "We recover commercial debts, personal loans, business-to-business invoices, rental arrears, bank and microfinance NPLs, insurance premiums, school fees, trade credit debts and more. We work across all sectors — banking, real estate, healthcare, education, telecoms and beyond."},
    {"category": "Debt Recovery", "sort_order": 2,
     "question": "How does your debt recovery process work?",
     "answer": "Our process follows 7 clear stages: Case Submission → Assessment & Strategy → Debtor Engagement → Negotiation & Settlement → Legal Action → Recovery & Auction → Reporting & Closure. You are kept updated at every stage. Visit our Recovery Process page for full details."},
    {"category": "Debt Recovery", "sort_order": 3,
     "question": "How long does debt recovery take?",
     "answer": "Timelines vary by case complexity. Simple cases with cooperative debtors may settle within 2–4 weeks. Cases requiring court action typically take 2–4 months. We provide a realistic timeline after assessing your specific case."},
    {"category": "Debt Recovery", "sort_order": 4,
     "question": "What are your fees for debt recovery?",
     "answer": "Our fees are performance-based — we charge a commission on amounts successfully recovered. This means you only pay when we collect. The exact rate depends on the debt type, age and complexity. Contact us for a free assessment and fee quote."},
    {"category": "Debt Recovery", "sort_order": 5,
     "question": "What information do I need to provide when submitting a case?",
     "answer": "You will need: the signed agreement or invoice, proof of the outstanding balance, debtor contact details and last known address, and any previous payment history or communications. The more documentation you provide, the faster we can act."},
    {"category": "Debt Recovery", "sort_order": 6,
     "question": "Can you recover debts from debtors who have relocated or gone silent?",
     "answer": "Yes. We offer professional skip-tracing services to locate debtors who have changed addresses, phone numbers or become unresponsive. Our investigators use legal databases, field visits and professional networks to trace them."},
    # Auctions & Court Orders
    {"category": "Auctions & Court Orders", "sort_order": 1,
     "question": "Are you licensed to conduct public auctions in Tanzania?",
     "answer": "Yes. We hold an official Auctioneer License (No. 000003633) under Tanzanian law. We conduct transparent, fully marketed and legally compliant public auctions for movable and immovable assets including property, vehicles, equipment and goods."},
    {"category": "Auctions & Court Orders", "sort_order": 2,
     "question": "What happens to the proceeds of an auction?",
     "answer": "Auction proceeds are applied to settle the outstanding debt first, including our agreed fees and any court costs. Any surplus remaining after full settlement is remitted to the debtor. A full financial statement is provided to all parties."},
    {"category": "Auctions & Court Orders", "sort_order": 3,
     "question": "Can you execute court orders on my behalf?",
     "answer": "Yes. Our certified court brokers handle the full execution of court decrees — including attachment of assets, service of court process documents and enforcement of judgments — across all jurisdictions in Tanzania."},
    {"category": "Auctions & Court Orders", "sort_order": 4,
     "question": "What is distress for rent and how does it work?",
     "answer": "Distress for rent is a legal remedy allowing landlords to recover unpaid rent by seizing and selling the tenant's goods. Our team manages the entire process lawfully — from issuing the required notices to levying distress and facilitating settlement."},
    # Client Portal
    {"category": "Client Portal", "sort_order": 1,
     "question": "What is the Client Portal?",
     "answer": "The Client Portal is a secure online platform where clients can submit new debt cases, track the status of active cases, download recovery reports and communicate with their assigned recovery officer — all in one place."},
    {"category": "Client Portal", "sort_order": 2,
     "question": "How do I access the Client Portal?",
     "answer": "Click \"Client Portal\" in the navigation menu or visit /portal/login. You will need login credentials issued by our team. Contact us at Office@hollyrespishers.com to request access."},
    {"category": "Client Portal", "sort_order": 3,
     "question": "Is the Client Portal secure?",
     "answer": "Yes. The portal uses JWT-based authentication, encrypted data transmission and role-based access controls. All client information and case data is handled with strict confidentiality in compliance with our Privacy Policy."},
]

faq_count = 0
for f in FAQS:
    exists = db.query(FAQ).filter(FAQ.category == f["category"], FAQ.question == f["question"]).first()
    if exists:
        print(f"  skip (exists): {f['question'][:50]}")
        continue
    faq = FAQ(
        category=f["category"],
        question=f["question"],
        answer=f["answer"],
        sort_order=f["sort_order"],
        is_published=True,
    )
    db.add(faq)
    faq_count += 1

db.commit()
print(f"FAQs inserted: {faq_count}")

# ── Testimonials ──────────────────────────────────────────────────────────────

TESTIMONIALS = [
    {
        "client_name": "Platinum Credit Ltd",
        "contact_role": "Credit Manager",
        "sector": "Microfinance",
        "rating": 5,
        "quote": "Hollyness & Respishers have been an invaluable partner in recovering our non-performing loan portfolio. Their professionalism, persistence and respect for our borrowers has made the process smooth and effective. We have seen remarkable results within short timelines.",
        "recovered": "Portfolio recovered within 60 days",
    },
    {
        "client_name": "Victoria Finance PLC",
        "contact_role": "Head of Recoveries",
        "sector": "Financial Institution",
        "rating": 5,
        "quote": "We engaged H&R for a batch of long-overdue commercial accounts. Their team conducted thorough skip tracing and debtor engagement that our internal team had exhausted. The results exceeded our expectations — over 80% of the targeted accounts reached settlement.",
        "recovered": "80%+ accounts settled",
    },
    {
        "client_name": "FINCA Microfinance Bank",
        "contact_role": "Branch Operations",
        "sector": "MFI Banking",
        "rating": 5,
        "quote": "What sets Hollyness & Respishers apart is their ethical approach. They recovered our debts without damaging our client relationships — which is critical for a microfinance institution. We continue to refer all our difficult accounts to their team.",
        "recovered": "Client relationships preserved",
    },
    {
        "client_name": "NMB Bank Plc",
        "contact_role": "Legal & Compliance",
        "sector": "Commercial Banking",
        "rating": 5,
        "quote": "H&R managed the execution of several court decrees on our behalf with precision and full compliance. Their knowledge of court processes and brokerage procedures saved us significant time and legal costs. Highly recommended for enforcement matters.",
        "recovered": "Court decrees executed on time",
    },
    {
        "client_name": "BRAC Tanzania",
        "contact_role": "Country Operations",
        "sector": "Development Finance",
        "rating": 5,
        "quote": "Their nationwide presence across five cities made them the ideal partner for our rural recovery needs. Their team in Mbeya, Dodoma and Dar es Salaam worked simultaneously on our portfolio — something no other agency we tried could offer.",
        "recovered": "Multi-city simultaneous recovery",
    },
    {
        "client_name": "NOE Microfinance Bank",
        "contact_role": "Risk & Recovery Department",
        "sector": "Microfinance",
        "rating": 5,
        "quote": "From the moment we submitted our case, we felt confident. The team kept us updated at every step, the documentation was impeccable, and the final recovery amounts were well above what we expected. A truly professional firm.",
        "recovered": "Above-target recovery achieved",
    },
]

test_count = 0
for t in TESTIMONIALS:
    exists = db.query(Testimonial).filter(Testimonial.client_name == t["client_name"]).first()
    if exists:
        print(f"  skip (exists): {t['client_name']}")
        continue
    testimonial = Testimonial(
        client_name=t["client_name"],
        contact_role=t["contact_role"],
        sector=t["sector"],
        rating=t["rating"],
        quote=t["quote"],
        recovered=t["recovered"],
        is_published=True,
    )
    db.add(testimonial)
    test_count += 1

db.commit()
print(f"Testimonials inserted: {test_count}")

# ── Site Settings ─────────────────────────────────────────────────────────────

SETTINGS = [
    # contact
    {"key": "contact_phone",       "value": "+255 762 058 614",                          "category": "contact",  "label": "Primary Phone Number"},
    {"key": "contact_whatsapp",    "value": "+255 762 058 614",                          "category": "contact",  "label": "WhatsApp Number"},
    {"key": "contact_email",       "value": "Office@hollyrespishers.com",                "category": "contact",  "label": "Main Email Address"},
    {"key": "contact_email_alt",   "value": "info@hollyrespishers.com",                  "category": "contact",  "label": "Alternative Email"},
    {"key": "contact_address",     "value": "Plot No. 1532, Old Forest St., BOT Road",   "category": "contact",  "label": "Street Address"},
    {"key": "contact_city",        "value": "Mbeya",                                     "category": "contact",  "label": "City"},
    {"key": "contact_po_box",      "value": "P.O. Box 741",                              "category": "contact",  "label": "P.O. Box"},
    {"key": "contact_hours",       "value": "Mon–Fri: 8:00am – 5:00pm",                  "category": "contact",  "label": "Business Hours"},
    # company
    {"key": "company_name",        "value": "Hollyness & Respishers Company Limited",    "category": "company",  "label": "Company Name"},
    {"key": "company_tagline",     "value": "Tanzania's Premier Debt Recovery & Auctioneering Specialists", "category": "company", "label": "Tagline"},
    {"key": "company_founded",     "value": "2021",                                      "category": "company",  "label": "Founded Year"},
    {"key": "company_reg_number",  "value": "150355419",                                 "category": "company",  "label": "Registration Number"},
    {"key": "company_license",     "value": "000003633",                                 "category": "company",  "label": "Auctioneer License No."},
    {"key": "company_cities",      "value": "5",                                         "category": "company",  "label": "Cities Count"},
    {"key": "company_clients",     "value": "10+",                                       "category": "company",  "label": "Clients Count"},
    {"key": "company_experience",  "value": "4+",                                        "category": "company",  "label": "Years of Experience"},
    # vision / mission
    {"key": "vision",              "value": "To be the leading commission agent in Tanzania, recognized for excellence in Debt Collection, Public Auctions, General Brokerage, Execution of Court Orders and Distress for Rent services.", "category": "company", "label": "Vision Statement"},
    {"key": "mission",             "value": "To provide high-quality, professional and confidential services at affordable rates, helping clients safeguard their interests and minimize financial losses, while strictly adhering to the laws and regulations of the United Republic of Tanzania.", "category": "company", "label": "Mission Statement"},
    # social
    {"key": "social_facebook",     "value": "",                                          "category": "social",   "label": "Facebook URL"},
    {"key": "social_twitter",      "value": "",                                          "category": "social",   "label": "Twitter / X URL"},
    {"key": "social_linkedin",     "value": "",                                          "category": "social",   "label": "LinkedIn URL"},
    {"key": "social_instagram",    "value": "",                                          "category": "social",   "label": "Instagram URL"},
    # stats (hero section)
    {"key": "stat_recovered",      "value": "TZS 313M+",                                 "category": "general",  "label": "Total Recovered (stat)"},
    {"key": "stat_cases",          "value": "500+",                                      "category": "general",  "label": "Cases Closed (stat)"},
    {"key": "stat_success_rate",   "value": "94%",                                       "category": "general",  "label": "Success Rate (stat)"},
]

setting_count = 0
for s in SETTINGS:
    exists = db.query(SiteSetting).filter(SiteSetting.key == s["key"]).first()
    if exists:
        print(f"  skip (exists): {s['key']}")
        continue
    db.add(SiteSetting(**s))
    setting_count += 1

db.commit()
print(f"Settings inserted: {setting_count}")

# ── Services ──────────────────────────────────────────────────────────────────

SERVICES = [
    # Core services
    {"title": "Debt Collection", "short_desc": "Efficient recovery of outstanding debts through legal, transparent and results-driven processes.", "full_desc": "We pursue overdue accounts on your behalf using professional, ethical and legally compliant methods — from initial debtor contact through to full settlement. Our team handles commercial, consumer and institutional debt portfolios nationwide.", "icon_name": "BriefcaseIcon", "category": "core", "features": [], "tag": "Core Service", "sort_order": 1, "is_active": True},
    {"title": "Public Auctions", "short_desc": "Licensed auctioneer services ensuring fair, compliant and well-marketed property and asset sales.", "full_desc": "As a licensed auctioneer under Tanzanian law, we conduct transparent public auctions for movable and immovable assets — including property, vehicles, equipment and goods — with full compliance, marketing and settlement support.", "icon_name": "BuildingStorefrontIcon", "category": "core", "features": [], "tag": "Core Service", "sort_order": 2, "is_active": True},
    {"title": "Execution of Court Orders", "short_desc": "Professional enforcement of court judgments and decrees across Tanzania.", "full_desc": "We hold certified competency in court brokerage and process serving (Law School of Tanzania, 2023). Our legal officers execute court decrees, enforce judgments and serve legal process documents with precision and full legal authority.", "icon_name": "ScaleIcon", "category": "core", "features": [], "tag": "Core Service", "sort_order": 3, "is_active": True},
    {"title": "Distress for Rent", "short_desc": "Legal recovery of unpaid rent for landlords and property managers across Tanzania.", "full_desc": "We assist property owners in lawfully recovering rental arrears by levying distress on tenants' goods, managing the legal process and facilitating settlement — protecting your rental income without jeopardising landlord-tenant relationships.", "icon_name": "HomeModernIcon", "category": "core", "features": [], "tag": "Core Service", "sort_order": 4, "is_active": True},
    {"title": "General Brokerage", "short_desc": "Trusted intermediaries in financial and commercial transactions.", "full_desc": "Acting as licensed commission agents, we facilitate transactions between buyers and sellers, lenders and borrowers, and other commercial parties — ensuring terms are fair, documented and executed with professional accountability.", "icon_name": "ArrowsRightLeftIcon", "category": "core", "features": [], "tag": "Core Service", "sort_order": 5, "is_active": True},
    # Additional services
    {"title": "Skip Tracing", "short_desc": "Locating debtors who have moved or cannot be reached through standard means.", "full_desc": "Our investigators use legal databases, field visits and professional networks across Tanzania to trace debtors who have relocated or become unresponsive. Conducted strictly within the bounds of Tanzanian law.", "icon_name": "MagnifyingGlassIcon", "category": "additional", "features": [], "tag": "Specialist", "sort_order": 6, "is_active": True},
    {"title": "Credit Investigation", "short_desc": "In-depth investigation of creditworthiness and debtor financial standing.", "full_desc": "We conduct thorough assessments of debtor financial positions, asset bases and business histories to inform recovery strategy and help clients make informed credit decisions.", "icon_name": "DocumentMagnifyingGlassIcon", "category": "additional", "features": [], "tag": "Specialist", "sort_order": 7, "is_active": True},
    {"title": "Credit Risk Management", "short_desc": "Advisory and tools to help clients minimise future credit exposure.", "full_desc": "We advise clients on customer screening, contract structuring, collateral documentation and early-warning systems to reduce the flow of new non-performing loans.", "icon_name": "ShieldExclamationIcon", "category": "additional", "features": [], "tag": "Specialist", "sort_order": 8, "is_active": True},
    {"title": "Debt Negotiation & Settlement", "short_desc": "Structured negotiation between creditors and debtors for agreed repayment.", "full_desc": "We facilitate structured negotiation to reach fair settlements — whether lump-sum payments, instalment arrangements or partial write-downs — with all terms formalised in writing.", "icon_name": "BanknotesIcon", "category": "additional", "features": [], "tag": "Specialist", "sort_order": 9, "is_active": True},
    {"title": "Asset Tracing", "short_desc": "Identification and location of debtor assets to support recovery action.", "full_desc": "We identify and locate debtor assets — including property, vehicles, bank accounts and business interests — to support attachment, execution and auction proceedings.", "icon_name": "CubeTransparentIcon", "category": "additional", "features": [], "tag": "Specialist", "sort_order": 10, "is_active": True},
    {"title": "International Debt Recovery", "short_desc": "Cross-border recovery support for debts owed by overseas parties.", "full_desc": "We provide cross-border recovery support for debts owed by parties who have relocated outside Tanzania, working with partner agencies and leveraging international legal instruments.", "icon_name": "GlobeAltIcon", "category": "additional", "features": [], "tag": "Specialist", "sort_order": 11, "is_active": True},
]

svc_count = 0
for s in SERVICES:
    if db.query(Service).filter(Service.title == s["title"]).first():
        print(f"  skip (exists): {s['title']}")
        continue
    db.add(Service(**s))
    svc_count += 1

db.commit()
print(f"Services inserted: {svc_count}")

# ── Team Members ──────────────────────────────────────────────────────────────

TEAM = [
    {"name": "Joachim Gabriel Kalungwe", "role": "Chief Executive Officer", "department": "Executive", "bio": "Over 10 years of progressive experience in debt recovery, management and company leadership. Skilled in administration, client relations, and operational oversight.", "education": "BA Political Science & Public Administration", "joined_year": 2021, "sort_order": 1, "is_active": True},
    {"name": "Getruda Audphas Myula",    "role": "Managing Director",       "department": "Executive", "bio": "Skilled administrator ensuring governance and accountability across all company operations.", "education": "BA Public Administration", "joined_year": 2021, "sort_order": 2, "is_active": True},
    {"name": "Godfrey Paul Chunda",      "role": "Recovery Manager",        "department": "Operations","bio": "Leads recovery operations with a focus on professionalism and integrity in all client engagements.", "education": "Diploma in Shipping & Port Management", "joined_year": 2021, "sort_order": 3, "is_active": True},
    {"name": "Jerry January",            "role": "Legal Advisor",           "department": "Legal",     "bio": "Provides legal advisory, contract management, corporate governance and compliance solutions.", "education": "Master of Laws (LL.M)", "joined_year": 2021, "sort_order": 4, "is_active": True},
]

team_count = 0
for m in TEAM:
    if db.query(TeamMember).filter(TeamMember.name == m["name"]).first():
        print(f"  skip (exists): {m['name']}")
        continue
    db.add(TeamMember(**m))
    team_count += 1

db.commit()
print(f"Team members inserted: {team_count}")

# ── Industries ────────────────────────────────────────────────────────────────

INDUSTRIES = [
    {"icon_name": "BuildingLibraryIcon",    "title": "Banks & Financial Institutions",  "description": "We partner with commercial banks and financial institutions to recover non-performing loans, enforce loan agreements and manage distressed portfolios across all branches in Tanzania.",                                                                                "cases": ["Non-performing loans", "Overdraft recovery", "Personal & business loan defaults", "Mortgage arrears"],                      "sort_order": 1,  "is_active": True},
    {"icon_name": "CurrencyDollarIcon",     "title": "SACCOs & Microfinance (MFIs)",    "description": "Our team understands the unique challenges facing cooperative societies and microfinance lenders — including member defaults and tracing borrowers who have relocated.",                                                                                               "cases": ["Member loan defaults", "Group lending recovery", "Skip tracing for relocated debtors", "Asset tracing"],                     "sort_order": 2,  "is_active": True},
    {"icon_name": "WrenchScrewdriverIcon",  "title": "Construction Companies",          "description": "We assist contractors and subcontractors in recovering unpaid invoices, enforcing retention payments and resolving outstanding debts from project owners and clients.",                                                                                                "cases": ["Unpaid contract invoices", "Retention fee disputes", "Subcontractor payment arrears", "Equipment hire debts"],               "sort_order": 3,  "is_active": True},
    {"icon_name": "ShieldCheckIcon",        "title": "Insurance Companies",             "description": "We support insurance firms in recovering fraudulent claims, unpaid premiums and outstanding balances, backed by thorough investigation and compliant legal processes.",                                                                                                "cases": ["Unpaid premium arrears", "Fraudulent claim recovery", "Broker commission disputes", "Policy debt recovery"],                 "sort_order": 4,  "is_active": True},
    {"icon_name": "DevicePhoneMobileIcon",  "title": "Telecom Companies",               "description": "From post-paid subscribers to corporate account holders, we recover outstanding airtime, data and service fees while preserving customer relationships wherever possible.",                                                                                            "cases": ["Post-paid subscriber debts", "Corporate account arrears", "Device financing defaults", "Service fee recovery"],             "sort_order": 5,  "is_active": True},
    {"icon_name": "HeartIcon",             "title": "Healthcare Institutions",          "description": "Hospitals, clinics and healthcare facilities rely on us to recover outstanding patient bills, insurance reimbursements and corporate health-cover arrears efficiently and professionally.",                                                                             "cases": ["Unpaid patient bills", "Insurance reimbursements", "Corporate health-cover debts", "Medical equipment financing"],          "sort_order": 6,  "is_active": True},
    {"icon_name": "AcademicCapIcon",        "title": "Schools & Universities",           "description": "Educational institutions trust us to handle the sensitive recovery of outstanding school fees, tuition arrears and student loan defaults with professionalism and discretion.",                                                                                        "cases": ["Tuition & school fee arrears", "Student loan defaults", "Hostel and boarding arrears", "Corporate training fee debts"],      "sort_order": 7,  "is_active": True},
    {"icon_name": "TruckIcon",             "title": "Suppliers & Distributors",         "description": "We help suppliers, wholesalers and distributors recover payment for goods delivered on credit, protecting cash flow and maintaining viable client relationships where appropriate.",                                                                                    "cases": ["Trade credit debts", "Invoice payment defaults", "Consignment recovery", "Dealer network arrears"],                         "sort_order": 8,  "is_active": True},
    {"icon_name": "HomeModernIcon",         "title": "Real Estate Companies",            "description": "Property owners, landlords and real estate agents engage us to recover unpaid rent, enforce lease agreements and execute distress for rent proceedings lawfully.",                                                                                                    "cases": ["Rental arrears recovery", "Distress for rent", "Lease agreement enforcement", "Property management debts"],                 "sort_order": 9,  "is_active": True},
    {"icon_name": "BuildingOffice2Icon",    "title": "Government Contractors",           "description": "We assist private contractors owed payment by government agencies and public institutions, navigating the legal processes required to recover public procurement debts.",                                                                                             "cases": ["Government tender payment arrears", "Public works invoice defaults", "Procurement contract debts", "Service contract recovery"], "sort_order": 10, "is_active": True},
    {"icon_name": "ScaleIcon",             "title": "Court Brokerage & Process Service", "description": "As certified court brokers (Law School of Tanzania, 2023), we execute court decrees, serve legal process documents and enforce judgments across all courts in Tanzania.",                                                                                           "cases": ["Execution of court decrees", "Service of legal process", "Judgment enforcement", "Writ of attachment service"],             "sort_order": 11, "is_active": True},
]

ind_count = 0
for ind in INDUSTRIES:
    if db.query(Industry).filter(Industry.title == ind["title"]).first():
        print(f"  skip (exists): {ind['title']}")
        continue
    db.add(Industry(**ind))
    ind_count += 1

db.commit()
print(f"Industries inserted: {ind_count}")

# ── Job Openings ──────────────────────────────────────────────────────────────

JOBS = [
    {"title": "Debt Recovery Officer",       "department": "Recovery Operations", "location": "Mbeya (HQ)",               "job_type": "Full-time", "summary": "Handle debtor engagement, field visits and negotiated settlements for assigned portfolios. Must be persistent, professional and comfortable with both phone and in-person debtor contact.", "requirements": ["Diploma or degree in Business, Law, Finance or related field", "Minimum 1 year experience in debt collection or field sales", "Strong communication and negotiation skills", "Valid driving licence preferred", "Fluency in Swahili; English proficiency an advantage"], "is_active": True},
    {"title": "Legal Officer / Court Broker", "department": "Legal & Compliance",  "location": "Mbeya / Dar es Salaam",    "job_type": "Full-time", "summary": "Manage court filings, execute decrees, serve process documents and provide legal advisory support to the recovery team. Court brokerage certification is a strong advantage.", "requirements": ["LLB degree or Diploma in Law", "Court brokerage certification (Law School of Tanzania) preferred", "Experience in litigation or enforcement proceedings", "Attention to detail and strong documentation skills", "Ability to work independently under deadlines"], "is_active": True},
    {"title": "Branch Operations Officer",   "department": "Operations",           "location": "Arusha / Dodoma / Mwanza", "job_type": "Full-time", "summary": "Manage day-to-day branch operations, client intake, case coordination and liaison between field teams and head office.", "requirements": ["Degree or Diploma in Business Administration or related field", "Minimum 2 years office management or operations experience", "Proficiency in MS Office and basic computer skills", "Strong organisational and communication skills", "Knowledge of the local business environment is an advantage"], "is_active": True},
    {"title": "Accounts & Finance Assistant", "department": "Finance",             "location": "Mbeya (HQ)",               "job_type": "Full-time", "summary": "Support the finance team with bookkeeping, invoicing, payment reconciliation and financial reporting.", "requirements": ["Diploma or degree in Accounting, Finance or related field", "Knowledge of accounting software (QuickBooks or similar)", "Understanding of Tanzanian tax and regulatory requirements", "High level of accuracy and integrity", "CPA (T) student or certified is an advantage"], "is_active": True},
]

job_count = 0
for j in JOBS:
    if db.query(JobOpening).filter(JobOpening.title == j["title"]).first():
        print(f"  skip (exists): {j['title']}")
        continue
    db.add(JobOpening(**j))
    job_count += 1

db.commit()
print(f"Job openings inserted: {job_count}")

# ── Process Steps ─────────────────────────────────────────────────────────────

PROCESS_STEPS = [
    {"step_number": 1, "icon_name": "DocumentTextIcon",        "title": "Case Submission",       "subtitle": "You submit your case",          "description": "The process begins when you submit a debt recovery case to us. You provide all relevant documentation — loan agreements, invoices, contracts, correspondence and any prior communication with the debtor. Our team reviews the file to confirm it is actionable.", "what_you_provide": ["Signed loan agreement or invoice", "Proof of outstanding balance", "Debtor contact details and last known address", "Any prior communication or payment history"], "outcome": "Case accepted and assigned to a dedicated recovery officer within 24 hours.", "duration": "1–2 business days", "is_active": True},
    {"step_number": 2, "icon_name": "MagnifyingGlassIcon",     "title": "Assessment & Strategy", "subtitle": "We analyse and plan",           "description": "Our team conducts a thorough assessment of the debtor's financial position, asset base and contact details. We use skip-tracing and credit investigation tools where needed to locate debtors who have relocated or are unresponsive. A tailored recovery strategy is then prepared.", "what_you_provide": ["Additional debtor background if available", "Preferred communication approach", "Any known debtor employment or business details"], "outcome": "Written recovery strategy delivered to client with estimated timeline and fees.", "duration": "2–5 business days", "is_active": True},
    {"step_number": 3, "icon_name": "ChatBubbleLeftRightIcon", "title": "Debtor Engagement",     "subtitle": "Professional first contact",    "description": "We initiate formal contact with the debtor via written demand notice, phone call and — where necessary — a personal visit. All communication is professional, firm and legally compliant. Our goal is to secure voluntary payment at this stage without escalating to legal action.", "what_you_provide": [], "outcome": "Debtor acknowledges the debt and agrees to a repayment plan, or declines — triggering the next stage.", "duration": "5–14 business days", "is_active": True},
    {"step_number": 4, "icon_name": "ScaleIcon",               "title": "Negotiation & Settlement", "subtitle": "Structured resolution",      "description": "Where the debtor engages, we facilitate structured negotiation to reach a fair settlement — whether a lump-sum payment, instalment arrangement or partial write-down. All agreed terms are formalised in writing. Our objective is maximum recovery with minimal cost to you.", "what_you_provide": ["Your minimum acceptable settlement position", "Approval of proposed repayment terms"], "outcome": "Written settlement agreement signed by both parties. Recovery begins immediately.", "duration": "7–21 business days", "is_active": True},
    {"step_number": 5, "icon_name": "BuildingLibraryIcon",     "title": "Legal Action",           "subtitle": "Court-backed enforcement",     "description": "If negotiation is unsuccessful or the debtor is uncooperative, we proceed to formal legal action. Our certified court brokers and legal advisors file suit, obtain judgment and serve court process documents. We handle all court filings and hearing attendance on your behalf.", "what_you_provide": ["Original signed documentation for court filing", "Authorisation letter for legal representation"], "outcome": "Court judgment obtained and decree issued in your favour.", "duration": "30–90 business days (court-dependent)", "is_active": True},
    {"step_number": 6, "icon_name": "BanknotesIcon",           "title": "Recovery & Auction",     "subtitle": "Assets seized and sold",       "description": "With a court decree in hand, we execute the judgment — levying distress, attaching debtor assets and conducting public auctions where required. As a licensed auctioneer under Tanzanian law, we manage the entire auction process: valuation, marketing, sale and settlement.", "what_you_provide": [], "outcome": "Assets sold, proceeds applied to the debt, and balance remitted to you within agreed timelines.", "duration": "14–30 business days post-judgment", "is_active": True},
    {"step_number": 7, "icon_name": "ChartBarIcon",            "title": "Reporting & Closure",    "subtitle": "Full transparency",            "description": "At every stage of the process, you receive written updates. Upon closure, we provide a full recovery report: amounts collected, costs incurred, actions taken and any remaining balance. We maintain confidential records for your file and advise on any residual enforcement options.", "what_you_provide": [], "outcome": "Comprehensive closure report delivered. Case file archived securely.", "duration": "Ongoing throughout the case", "is_active": True},
]

step_count = 0
for ps in PROCESS_STEPS:
    if db.query(ProcessStep).filter(ProcessStep.step_number == ps["step_number"]).first():
        print(f"  skip (exists): step {ps['step_number']}")
        continue
    db.add(ProcessStep(**ps))
    step_count += 1

db.commit()
db.close()
print(f"Process steps inserted: {step_count}")
print("Done.")
