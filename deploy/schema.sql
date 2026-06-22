--
-- PostgreSQL database dump
-- Hollyness & Respishers Company Limited
-- Generated: 2026-06-21
--

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX IF EXISTS public.ix_users_id;
DROP INDEX IF EXISTS public.ix_users_email;
DROP INDEX IF EXISTS public.ix_testimonials_id;
DROP INDEX IF EXISTS public.ix_team_members_id;
DROP INDEX IF EXISTS public.ix_site_settings_key;
DROP INDEX IF EXISTS public.ix_site_settings_id;
DROP INDEX IF EXISTS public.ix_services_id;
DROP INDEX IF EXISTS public.ix_process_steps_id;
DROP INDEX IF EXISTS public.ix_partners_id;
DROP INDEX IF EXISTS public.ix_newsletter_subscribers_id;
DROP INDEX IF EXISTS public.ix_newsletter_subscribers_email;
DROP INDEX IF EXISTS public.ix_job_openings_id;
DROP INDEX IF EXISTS public.ix_industries_id;
DROP INDEX IF EXISTS public.ix_faqs_id;
DROP INDEX IF EXISTS public.ix_contact_inquiries_id;
DROP INDEX IF EXISTS public.ix_career_applications_id;
DROP INDEX IF EXISTS public.ix_blog_posts_slug;
DROP INDEX IF EXISTS public.ix_blog_posts_id;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonials DROP CONSTRAINT IF EXISTS testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.team_members DROP CONSTRAINT IF EXISTS team_members_pkey;
ALTER TABLE IF EXISTS ONLY public.site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_pkey;
ALTER TABLE IF EXISTS ONLY public.process_steps DROP CONSTRAINT IF EXISTS process_steps_pkey;
ALTER TABLE IF EXISTS ONLY public.partners DROP CONSTRAINT IF EXISTS partners_pkey;
ALTER TABLE IF EXISTS ONLY public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_pkey;
ALTER TABLE IF EXISTS ONLY public.industries DROP CONSTRAINT IF EXISTS industries_pkey;
ALTER TABLE IF EXISTS ONLY public.faqs DROP CONSTRAINT IF EXISTS faqs_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_inquiries DROP CONSTRAINT IF EXISTS contact_inquiries_pkey;
ALTER TABLE IF EXISTS ONLY public.career_applications DROP CONSTRAINT IF EXISTS career_applications_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.testimonials ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.team_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.site_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.process_steps ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.partners ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.newsletter_subscribers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.job_openings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.industries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.faqs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_inquiries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_applications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog_posts ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.testimonials_id_seq;
DROP TABLE IF EXISTS public.testimonials;
DROP SEQUENCE IF EXISTS public.team_members_id_seq;
DROP TABLE IF EXISTS public.team_members;
DROP SEQUENCE IF EXISTS public.site_settings_id_seq;
DROP TABLE IF EXISTS public.site_settings;
DROP SEQUENCE IF EXISTS public.services_id_seq;
DROP TABLE IF EXISTS public.services;
DROP SEQUENCE IF EXISTS public.process_steps_id_seq;
DROP TABLE IF EXISTS public.process_steps;
DROP SEQUENCE IF EXISTS public.partners_id_seq;
DROP TABLE IF EXISTS public.partners;
DROP SEQUENCE IF EXISTS public.newsletter_subscribers_id_seq;
DROP TABLE IF EXISTS public.newsletter_subscribers;
DROP SEQUENCE IF EXISTS public.job_openings_id_seq;
DROP TABLE IF EXISTS public.job_openings;
DROP SEQUENCE IF EXISTS public.industries_id_seq;
DROP TABLE IF EXISTS public.industries;
DROP SEQUENCE IF EXISTS public.faqs_id_seq;
DROP TABLE IF EXISTS public.faqs;
DROP SEQUENCE IF EXISTS public.contact_inquiries_id_seq;
DROP TABLE IF EXISTS public.contact_inquiries;
DROP SEQUENCE IF EXISTS public.career_applications_id_seq;
DROP TABLE IF EXISTS public.career_applications;
DROP SEQUENCE IF EXISTS public.blog_posts_id_seq;
DROP TABLE IF EXISTS public.blog_posts;
DROP TYPE IF EXISTS public.contactstatus;
DROP TYPE IF EXISTS public.applicationstatus;
--
-- Name: applicationstatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.applicationstatus AS ENUM (
    'received',
    'reviewing',
    'shortlisted',
    'rejected',
    'hired'
);


--
-- Name: contactstatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.contactstatus AS ENUM (
    'new',
    'read',
    'replied',
    'archived'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    slug character varying(300) NOT NULL,
    category character varying(100) NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    read_time character varying(30),
    is_published boolean,
    is_featured boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    published_at timestamp with time zone,
    cover_image character varying(500)
);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: career_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_applications (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(30),
    "position" character varying(150) NOT NULL,
    cover_letter text NOT NULL,
    status public.applicationstatus NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: career_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_applications_id_seq OWNED BY public.career_applications.id;


--
-- Name: contact_inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_inquiries (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(30),
    organization character varying(150),
    service character varying(100) NOT NULL,
    message text NOT NULL,
    status public.contactstatus NOT NULL,
    ip_address character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: contact_inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_inquiries_id_seq OWNED BY public.contact_inquiries.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    sort_order integer,
    is_published boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: industries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.industries (
    id integer NOT NULL,
    icon_name character varying(100),
    title character varying(200) NOT NULL,
    description text,
    cases json,
    sort_order integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: industries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.industries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: industries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.industries_id_seq OWNED BY public.industries.id;


--
-- Name: job_openings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_openings (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    department character varying(200),
    location character varying(200),
    job_type character varying(50),
    summary text,
    requirements json,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: job_openings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_openings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_openings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_openings_id_seq OWNED BY public.job_openings.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    logo_url character varying(500),
    description text,
    website_url character varying(500),
    sort_order integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: process_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.process_steps (
    id integer NOT NULL,
    step_number integer NOT NULL,
    title character varying(200) NOT NULL,
    subtitle character varying(300),
    description text,
    what_you_provide json,
    outcome character varying(300),
    duration character varying(100),
    icon_name character varying(100),
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: process_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.process_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.process_steps_id_seq OWNED BY public.process_steps.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    short_desc text,
    full_desc text,
    icon_name character varying(100),
    category character varying(50),
    features json,
    tag character varying(100),
    sort_order integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    category character varying(50),
    label character varying(200),
    updated_at timestamp with time zone
);


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    role character varying(200),
    department character varying(200),
    bio text,
    education character varying(300),
    joined_year character varying(10),
    photo_url character varying(500),
    sort_order integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    client_name character varying(150) NOT NULL,
    contact_role character varying(100),
    sector character varying(100),
    quote text NOT NULL,
    recovered character varying(200),
    rating integer,
    is_published boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    photo_url character varying(500)
);


--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    full_name character varying NOT NULL,
    hashed_password character varying NOT NULL,
    is_active boolean,
    is_admin boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: career_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_applications ALTER COLUMN id SET DEFAULT nextval('public.career_applications_id_seq'::regclass);


--
-- Name: contact_inquiries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_inquiries ALTER COLUMN id SET DEFAULT nextval('public.contact_inquiries_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: industries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries ALTER COLUMN id SET DEFAULT nextval('public.industries_id_seq'::regclass);


--
-- Name: job_openings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings ALTER COLUMN id SET DEFAULT nextval('public.job_openings_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: process_steps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.process_steps ALTER COLUMN id SET DEFAULT nextval('public.process_steps_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, slug, category, excerpt, content, read_time, is_published, is_featured, created_at, updated_at, published_at, cover_image) FROM stdin;
3	How Public Auctions Work in Tanzania: A Step-by-Step Overview	how-public-auctions-work-in-tanzania-a-step-by-step-overview	Auctioneering	Public auctions are a powerful tool for recovering value from distressed assets. This article explains the legal framework, how assets are valued and marketed, and what buyers and sellers can expect on auction day.	Public auctions are an essential mechanism in Tanzania's debt recovery and asset disposal landscape. When a debtor cannot or will not pay, a properly conducted auction can realise significant value from their assets — often more than creditors expect.\n\nThe process begins with proper legal authority. An auctioneer can only sell assets under a court order, a writ of execution or a distress for rent warrant. Hollyness & Respishers, as licensed auctioneers, handle the legal documentation to ensure every sale is bulletproof.\n\nAsset valuation follows authorisation. Our team conducts professional assessments of movable property (vehicles, equipment, furniture, stock) and immovable property (land, buildings). Accurate valuation protects creditors from underselling while setting a realistic reserve price.\n\nMarketing is where many auctioneers cut corners — and where we distinguish ourselves. We advertise upcoming auctions through newspapers, social media, direct outreach to known buyers and our professional network, maximising attendance and competitive bidding.\n\nOn auction day, our auctioneers conduct a transparent, legally compliant sale. All bids are recorded, the highest bidder is declared, payment is collected and legal transfer documents are prepared. Proceeds are applied to the debt first, with any surplus returned to the debtor.\n\nPost-auction reporting gives creditors a complete financial statement showing gross proceeds, deductions and net recovery. Full transparency at every step.	7 min read	t	t	2026-06-13 10:38:30.127189+03	2026-06-14 03:43:33.067532+03	2026-04-30 10:38:30.129117+03	\N
4	Skip Tracing: How We Locate Debtors Who Have Relocated or Gone Silent	skip-tracing-how-we-locate-debtors-who-have-relocated-or-gone-silent	Debt Recovery	One of the biggest challenges in debt recovery is finding debtors who have moved, changed phone numbers or become unresponsive. Our skip-tracing team uses a combination of legal databases, field investigations and professional networks.	A debtor who cannot be located cannot be compelled to pay. Skip tracing — the professional process of locating a missing person for legal purposes — is one of the most valuable tools in our recovery arsenal.\n\nOur skip-tracing process begins with an analysis of all available information: last known address, employer details, vehicle registration, family contacts and any other data the creditor can provide. Even seemingly outdated information often yields useful leads.\n\nWe then cross-reference this against legal and commercial databases available to licensed agents. Business registration records, court records and property registries frequently reveal current addresses or employer details that debtors believe are hidden.\n\nField investigation is the next layer. Our investigators visit last known addresses, speak with neighbours and local contacts, and conduct discreet enquiries in the areas where the debtor was known to operate. Tanzania's communities are often closely networked, and professional field work yields results that database searches miss.\n\nProfessional networks round out the approach. Our relationships with other licensed agents, legal firms and financial institutions across Tanzania's five major cities mean that information on relocated debtors often surfaces through trusted channels.\n\nSkip tracing is conducted strictly within the bounds of Tanzanian law. We do not engage in harassment, deception or any activity that could expose our clients to counter-claims. Our goal is location and legal engagement — nothing more.	4 min read	f	f	2026-06-13 10:38:30.127189+03	2026-06-14 03:42:58.794973+03	2026-04-18 10:38:30.129577+03	\N
2	Key Changes to Tanzania's Debt Collection Regulations: What Businesses Need to Know	key-changes-to-tanzanias-debt-collection-regulations-what-businesses-need-to-know	Legal Updates	Recent regulatory updates affect how debt collection agents operate in Tanzania. We break down the key changes, what they mean for creditors and how licensed commission agents must adapt their practices.	Tanzania's regulatory environment for debt collection has evolved significantly in recent years. Licensed commission agents are now subject to stricter oversight, and businesses that outsource their debt recovery must ensure they work with fully compliant partners.\n\nThe most significant change involves enhanced disclosure requirements. Debt collection agents must now provide debtors with a clear written statement of the debt, its origin and the debtor's rights before any recovery action is taken. This protects consumers while ensuring the process remains transparent.\n\nLicensing requirements have also been tightened. Only agents holding a current Auctioneer License and registered with the relevant regulatory authority may legally collect debts on behalf of third parties. Businesses found using unlicensed collectors face significant penalties.\n\nFor creditors, these changes mean due diligence is more important than ever. Before engaging a debt recovery firm, verify their license number, check their regulatory status and review their compliance procedures. Hollyness & Respishers (Auctioneer License No. 000003633) maintains full compliance with all current regulations.\n\nThe changes ultimately benefit creditors who work with licensed professionals, as legally sound recovery processes are far less likely to be challenged or invalidated by debtors seeking technical grounds for avoidance.	5 min read	t	t	2026-06-13 10:38:30.127189+03	2026-06-14 03:43:31.775216+03	2026-05-12 10:38:30.128587+03	\N
6	Execution of Court Decrees in Tanzania: Rights, Procedures and Timelines	execution-of-court-decrees-in-tanzania-rights-procedures-and-timelines	Legal Updates	Winning a court case is only half the battle — enforcing the judgment is where many creditors struggle. This article outlines the legal procedures for executing court decrees in Tanzania and the role of certified court brokers.	Obtaining a court judgment against a debtor is a significant legal victory. But without proper enforcement, a judgment is merely a piece of paper. Execution — the legal process of compelling a judgment debtor to satisfy the decree — is where many creditors discover they need specialist help.\n\nIn Tanzania, execution of decrees is governed by the Civil Procedure Code. The process begins with an application to the court that issued the judgment, requesting a writ of execution. This writ authorises a court broker to take specific enforcement actions against the debtor's property.\n\nThe most common form of execution is attachment and sale of movable property. Under this process, the court broker (a role our certified officers hold) attends the debtor's premises, identifies and lists available assets, issues the required notices and — if payment is not made — proceeds to public auction.\n\nImmovable property (land and buildings) can also be attached and sold, though this involves a more complex process including a property search, valuation and court approval of the sale terms. Timelines are longer but recovery amounts are typically higher.\n\nGarnishee proceedings offer another avenue: where the debtor has funds held by a third party (such as a bank or an employer), the court can direct that third party to pay the creditor directly. This is often the fastest execution method when applicable.\n\nHollyness & Respishers holds certified court broker qualifications from the Law School of Tanzania. We manage the full execution process on behalf of creditors — from drafting the writ application to final settlement of proceeds.	6 min read	t	f	2026-06-13 10:38:30.127189+03	\N	2026-03-22 10:38:30.130569+03	\N
7	Distress for Rent: What Landlords in Tanzania Can and Cannot Do	distress-for-rent-what-landlords-in-tanzania-can-and-cannot-do	Industry Insights	Many landlords resort to self-help measures when tenants fall into arrears — which can expose them to legal liability. We clarify the lawful process for levying distress for rent and recovering rental arrears under Tanzanian law.	Rental arrears are a persistent problem for both residential and commercial landlords in Tanzania. Faced with non-paying tenants, many landlords are tempted to take matters into their own hands — changing locks, removing belongings or cutting utilities. These actions are illegal and expose landlords to serious counter-claims.\n\nThe lawful remedy for unpaid rent is distress for rent: a formal legal process that allows a landlord to seize and sell a tenant's goods to recover unpaid rent. This right is well-established under Tanzanian law but must be exercised strictly according to procedure.\n\nThe process requires proper notice to be served on the tenant before any seizure takes place. The notice specifies the amount outstanding, the basis of the claim and the deadline for payment. Many tenants pay at this stage, making further action unnecessary.\n\nIf payment is not received, a licensed auctioneer (such as Hollyness & Respishers) can attend the premises, create an inventory of seizable goods, and place them under seizure. The goods remain at the premises during a final opportunity period for the tenant to pay.\n\nWhere payment still does not occur, the seized goods are sold at public auction, with proceeds applied to the rental arrears and costs. Any surplus is returned to the tenant.\n\nCritically, landlords cannot conduct this process themselves. Only licensed auctioneers have the authority to levy distress. Attempting to do so personally constitutes trespass and wrongful interference with goods — regardless of how much rent is owed.	5 min read	t	f	2026-06-13 10:38:30.127189+03	\N	2026-03-10 10:38:30.131072+03	\N
9	Credit Risk Management: Preventing Bad Debts Before They Occur	credit-risk-management-preventing-bad-debts-before-they-occur	Debt Recovery	The best debt recovery strategy is one you never need to use. This guide covers practical credit risk management techniques for businesses in Tanzania — from customer screening to contract structuring.	Prevention is always more cost-effective than cure in debt management. While Hollyness & Respishers excels at recovering bad debts, we also advise clients on how to reduce the flow of new NPLs through better credit risk management practices.\n\nThe foundation is thorough customer screening before extending credit. This means verifying business registration details, checking for prior court judgments, requesting bank references and — where possible — reviewing recent financial statements. In Tanzania's SME sector, formal credit bureaus are not yet universal, making direct verification even more important.\n\nContract structuring is the second critical layer. Many bad debts arise not from debtor unwillingness but from poorly drafted agreements that create disputes about what is actually owed. Clear payment terms, defined milestones, late payment penalties and unambiguous default provisions all strengthen your position if recovery becomes necessary.\n\nCollateral and guarantees significantly improve recovery prospects. A personal guarantee from a director, a charge over specific assets or a deposit against future services gives you concrete recourse if the primary debtor defaults. Ensure all security interests are properly documented and registered where required.\n\nEarly warning systems allow intervention before accounts deteriorate. Setting internal triggers — such as automatic follow-up at 7 days overdue and formal escalation at 30 days — means debtors hear from you while the relationship is still manageable and before the debt has become difficult to recover.\n\nFinally, maintaining good client relationships paradoxically helps with collections. Clients who value your relationship are more likely to prioritise your invoice when cash is tight. Regular communication, excellent service delivery and fair dispute resolution all contribute to a stronger collections environment.	7 min read	t	f	2026-06-13 10:38:30.127189+03	\N	2026-02-14 10:38:30.132068+03	\N
5	Non-Performing Loans in Tanzania: Trends, Causes and Recovery Strategies	non-performing-loans-in-tanzania-trends-causes-and-recovery-strategies	Industry Insights	Tanzania's banking and microfinance sectors continue to grapple with rising NPL ratios. We examine the root causes, which sectors are most affected, and the most effective strategies for reducing exposure and recovering value.	Non-performing loans remain one of the most significant challenges facing Tanzania's financial sector. With NPL ratios stubbornly elevated across commercial banks and microfinance institutions, understanding the underlying causes is essential to developing effective recovery strategies.\n\nThe primary drivers of NPL growth in Tanzania include over-optimistic credit assessment, inadequate collateral documentation and macroeconomic shocks affecting borrowers' ability to repay. Agricultural loans are particularly vulnerable to weather-related disruptions, while commercial loans suffer during periods of currency volatility.\n\nMicrofinance institutions face a unique challenge: their borrowers often lack formal credit histories, making assessment difficult, and their loan books are characterised by high volumes of small-value accounts — expensive to pursue individually through traditional legal channels.\n\nThe most effective recovery strategy depends on portfolio characteristics. For large commercial loans, structured negotiation backed by a credible legal threat is usually most effective. For micro-loan portfolios, batch processing — grouping similar accounts and applying standardised engagement protocols — delivers better economics.\n\nEarly intervention remains the single most impactful factor. Loans addressed within 90 days of default recover at significantly higher rates than those left to age. Creditors who establish clear escalation procedures and engage professional recovery agents early consistently outperform those who wait.\n\nHollyness & Respishers offers portfolio analysis, segmentation and customised recovery strategies for financial institutions managing NPL exposure. Contact us for a confidential assessment.	8 min read	t	t	2026-06-13 10:38:30.127189+03	2026-06-14 03:43:54.380017+03	2026-04-05 10:38:30.130074+03	\N
1	Understanding the Debt Recovery Process in Tanzania: A Guide for Creditors	understanding-the-debt-recovery-process-in-tanzania-a-guide-for-creditors	Debt Recovery	Many creditors in Tanzania are unaware of the legal tools available to recover outstanding debts. This guide walks through the step-by-step process — from demand notices to court execution — and what to expect at each stage.	Recovering a debt in Tanzania involves a structured legal process that, when followed correctly, gives creditors the best chance of full recovery. Many creditors mistakenly believe that once a debtor stops communicating, the debt is unrecoverable. This is rarely true.\n\nThe process begins with a formal demand notice. This written notice states the outstanding amount, the deadline for payment and the consequences of non-payment. A well-drafted demand notice often prompts payment without any further action — many debtors simply need a firm, official reminder.\n\nIf the demand notice is ignored, the next step is negotiation and structured settlement. A professional debt recovery agent can facilitate this, proposing payment plans that are acceptable to both parties. This approach recovers money faster than litigation in most cases and preserves the business relationship where possible.\n\nWhere amicable settlement fails, legal action becomes necessary. This involves filing a claim in the appropriate Tanzanian court — the Resident Magistrate's Court for smaller claims and the High Court for larger ones. Once a judgment is obtained, our certified court brokers can execute it by attaching and auctioning the debtor's assets.\n\nUnderstanding each stage helps creditors set realistic expectations and make informed decisions about when to escalate. Hollyness & Respishers guides clients through every step, providing transparent updates and professional advocacy throughout.	6 min read	t	t	2026-06-13 10:38:30.127189+03	2026-06-14 21:22:20.86484+03	2026-05-20 10:38:30.127977+03	\N
8	Hollyness & Respishers Expands Services to Arusha and Dodoma	hollyness-respishers-expands-services-to-arusha-and-dodoma	Company News	We are pleased to announce the expansion of our operational presence to Arusha and Dodoma, bringing our professional debt recovery and auctioneering services to clients in northern and central Tanzania.	Hollyness & Respishers Company Limited is proud to announce the expansion of our operational network to include dedicated service coverage in Arusha and Dodoma, complementing our existing offices in Mbeya, Dar es Salaam and Mwanza.\n\nThis expansion reflects both the growth of our client base and our commitment to providing truly nationwide debt recovery and auctioneering services. Many of our existing clients have debtors spread across Tanzania, and having local representatives in each major city significantly enhances our ability to act quickly and effectively.\n\nArusha, as a major commercial centre and the hub of East African trade, has a growing need for professional recovery services. Our Arusha team will serve clients in the northern corridor, working closely with the local business community and legal professionals.\n\nDodoma, as Tanzania's capital, hosts significant government and institutional activity. Our presence there enables us to serve public sector clients and financial institutions with operations in the central region more effectively.\n\nClients with outstanding portfolios that include debtors in northern or central Tanzania are encouraged to contact us to discuss how our expanded coverage can accelerate recovery. Our national footprint — now five cities — remains unique among Tanzanian commission agents.\n\nWe thank our clients and partners for their continued trust and look forward to delivering even better results across the country.	3 min read	t	f	2026-06-13 10:38:30.127189+03	2026-06-14 04:17:07.872304+03	2026-02-28 10:38:30.131565+03	/uploads/blog/8_a1ac93376d604de4881a9bfbe9638265.jpeg
\.


--
-- Data for Name: career_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_applications (id, name, email, phone, "position", cover_letter, status, created_at, updated_at) FROM stdin;
1	allan mwakibinga	iamallan66@gmail.com	0743068974	Debt Recovery Officer	gvhm,bjm,tgvbj,mnhl.;kmjbvm ghjh	reviewing	2026-06-14 21:14:33.001102+03	2026-06-14 21:15:21.682996+03
\.


--
-- Data for Name: contact_inquiries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_inquiries (id, name, email, phone, organization, service, message, status, ip_address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faqs (id, category, question, answer, sort_order, is_published, created_at, updated_at) FROM stdin;
1	General	What is Hollyness & Respishers Company Limited?	Hollyness & Respishers Company Limited is a fully licensed commission agent incorporated in Tanzania on 5th February 2021. We provide professional debt collection, public auctioneering, execution of court orders, distress for rent and general brokerage services to individuals, businesses and institutions across Tanzania.	1	t	2026-06-13 10:38:30.29664+03	\N
2	General	Where are your offices located?	Our head office is in Mbeya (Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741). We also have branch offices in Dar es Salaam, Arusha, Dodoma and Mwanza — giving us full nationwide coverage.	2	t	2026-06-13 10:38:30.29664+03	\N
3	General	Are you licensed and regulated?	Yes. We hold an Auctioneer License (No. 000003633) and are registered with the relevant regulatory authorities in Tanzania. Our legal officers hold certified competency in court brokerage and process serving from the Law School of Tanzania (2023).	3	t	2026-06-13 10:38:30.29664+03	\N
4	General	How do I contact your team?	You can reach us by phone at +255 762 058 614, via WhatsApp at the same number, or by email at Office@hollyrespishers.com. You can also use the contact form on our website and we will respond within 24 hours on business days.	4	t	2026-06-13 10:38:30.29664+03	\N
5	Debt Recovery	What types of debts do you recover?	We recover commercial debts, personal loans, business-to-business invoices, rental arrears, bank and microfinance NPLs, insurance premiums, school fees, trade credit debts and more. We work across all sectors — banking, real estate, healthcare, education, telecoms and beyond.	1	t	2026-06-13 10:38:30.29664+03	\N
6	Debt Recovery	How does your debt recovery process work?	Our process follows 7 clear stages: Case Submission → Assessment & Strategy → Debtor Engagement → Negotiation & Settlement → Legal Action → Recovery & Auction → Reporting & Closure. You are kept updated at every stage. Visit our Recovery Process page for full details.	2	t	2026-06-13 10:38:30.29664+03	\N
7	Debt Recovery	How long does debt recovery take?	Timelines vary by case complexity. Simple cases with cooperative debtors may settle within 2–4 weeks. Cases requiring court action typically take 2–4 months. We provide a realistic timeline after assessing your specific case.	3	t	2026-06-13 10:38:30.29664+03	\N
8	Debt Recovery	What are your fees for debt recovery?	Our fees are performance-based — we charge a commission on amounts successfully recovered. This means you only pay when we collect. The exact rate depends on the debt type, age and complexity. Contact us for a free assessment and fee quote.	4	t	2026-06-13 10:38:30.29664+03	\N
9	Debt Recovery	What information do I need to provide when submitting a case?	You will need: the signed agreement or invoice, proof of the outstanding balance, debtor contact details and last known address, and any previous payment history or communications. The more documentation you provide, the faster we can act.	5	t	2026-06-13 10:38:30.29664+03	\N
10	Debt Recovery	Can you recover debts from debtors who have relocated or gone silent?	Yes. We offer professional skip-tracing services to locate debtors who have changed addresses, phone numbers or become unresponsive. Our investigators use legal databases, field visits and professional networks to trace them.	6	t	2026-06-13 10:38:30.29664+03	\N
11	Auctions & Court Orders	Are you licensed to conduct public auctions in Tanzania?	Yes. We hold an official Auctioneer License (No. 000003633) under Tanzanian law. We conduct transparent, fully marketed and legally compliant public auctions for movable and immovable assets including property, vehicles, equipment and goods.	1	t	2026-06-13 10:38:30.29664+03	\N
12	Auctions & Court Orders	What happens to the proceeds of an auction?	Auction proceeds are applied to settle the outstanding debt first, including our agreed fees and any court costs. Any surplus remaining after full settlement is remitted to the debtor. A full financial statement is provided to all parties.	2	t	2026-06-13 10:38:30.29664+03	\N
13	Auctions & Court Orders	Can you execute court orders on my behalf?	Yes. Our certified court brokers handle the full execution of court decrees — including attachment of assets, service of court process documents and enforcement of judgments — across all jurisdictions in Tanzania.	3	t	2026-06-13 10:38:30.29664+03	\N
14	Auctions & Court Orders	What is distress for rent and how does it work?	Distress for rent is a legal remedy allowing landlords to recover unpaid rent by seizing and selling the tenant's goods. Our team manages the entire process lawfully — from issuing the required notices to levying distress and facilitating settlement.	4	t	2026-06-13 10:38:30.29664+03	\N
15	Client Portal	What is the Client Portal?	The Client Portal is a secure online platform where clients can submit new debt cases, track the status of active cases, download recovery reports and communicate with their assigned recovery officer — all in one place.	1	t	2026-06-13 10:38:30.29664+03	\N
16	Client Portal	How do I access the Client Portal?	Click "Client Portal" in the navigation menu or visit /portal/login. You will need login credentials issued by our team. Contact us at Office@hollyrespishers.com to request access.	2	t	2026-06-13 10:38:30.29664+03	\N
17	Client Portal	Is the Client Portal secure?	Yes. The portal uses JWT-based authentication, encrypted data transmission and role-based access controls. All client information and case data is handled with strict confidentiality in compliance with our Privacy Policy.	3	t	2026-06-13 10:38:30.29664+03	\N
\.


--
-- Data for Name: industries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.industries (id, icon_name, title, description, cases, sort_order, is_active, created_at) FROM stdin;
1	BuildingLibraryIcon	Banks & Financial Institutions	We partner with commercial banks and financial institutions to recover non-performing loans, enforce loan agreements and manage distressed portfolios across all branches in Tanzania.	["Non-performing loans", "Overdraft recovery", "Personal & business loan defaults", "Mortgage arrears"]	1	t	2026-06-13 11:12:46.819931+03
2	CurrencyDollarIcon	SACCOs & Microfinance (MFIs)	Our team understands the unique challenges facing cooperative societies and microfinance lenders — including member defaults and tracing borrowers who have relocated.	["Member loan defaults", "Group lending recovery", "Skip tracing for relocated debtors", "Asset tracing"]	2	t	2026-06-13 11:12:46.819931+03
3	WrenchScrewdriverIcon	Construction Companies	We assist contractors and subcontractors in recovering unpaid invoices, enforcing retention payments and resolving outstanding debts from project owners and clients.	["Unpaid contract invoices", "Retention fee disputes", "Subcontractor payment arrears", "Equipment hire debts"]	3	t	2026-06-13 11:12:46.819931+03
4	ShieldCheckIcon	Insurance Companies	We support insurance firms in recovering fraudulent claims, unpaid premiums and outstanding balances, backed by thorough investigation and compliant legal processes.	["Unpaid premium arrears", "Fraudulent claim recovery", "Broker commission disputes", "Policy debt recovery"]	4	t	2026-06-13 11:12:46.819931+03
5	DevicePhoneMobileIcon	Telecom Companies	From post-paid subscribers to corporate account holders, we recover outstanding airtime, data and service fees while preserving customer relationships wherever possible.	["Post-paid subscriber debts", "Corporate account arrears", "Device financing defaults", "Service fee recovery"]	5	t	2026-06-13 11:12:46.819931+03
6	HeartIcon	Healthcare Institutions	Hospitals, clinics and healthcare facilities rely on us to recover outstanding patient bills, insurance reimbursements and corporate health-cover arrears efficiently and professionally.	["Unpaid patient bills", "Insurance reimbursements", "Corporate health-cover debts", "Medical equipment financing"]	6	t	2026-06-13 11:12:46.819931+03
7	AcademicCapIcon	Schools & Universities	Educational institutions trust us to handle the sensitive recovery of outstanding school fees, tuition arrears and student loan defaults with professionalism and discretion.	["Tuition & school fee arrears", "Student loan defaults", "Hostel and boarding arrears", "Corporate training fee debts"]	7	t	2026-06-13 11:12:46.819931+03
8	TruckIcon	Suppliers & Distributors	We help suppliers, wholesalers and distributors recover payment for goods delivered on credit, protecting cash flow and maintaining viable client relationships where appropriate.	["Trade credit debts", "Invoice payment defaults", "Consignment recovery", "Dealer network arrears"]	8	t	2026-06-13 11:12:46.819931+03
9	HomeModernIcon	Real Estate Companies	Property owners, landlords and real estate agents engage us to recover unpaid rent, enforce lease agreements and execute distress for rent proceedings lawfully.	["Rental arrears recovery", "Distress for rent", "Lease agreement enforcement", "Property management debts"]	9	t	2026-06-13 11:12:46.819931+03
10	BuildingOffice2Icon	Government Contractors	We assist private contractors owed payment by government agencies and public institutions, navigating the legal processes required to recover public procurement debts.	["Government tender payment arrears", "Public works invoice defaults", "Procurement contract debts", "Service contract recovery"]	10	t	2026-06-13 11:12:46.819931+03
11	ScaleIcon	Court Brokerage & Process Service	As certified court brokers (Law School of Tanzania, 2023), we execute court decrees, serve legal process documents and enforce judgments across all courts in Tanzania.	["Execution of court decrees", "Service of legal process", "Judgment enforcement", "Writ of attachment service"]	11	t	2026-06-13 11:12:46.819931+03
\.


--
-- Data for Name: job_openings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings (id, title, department, location, job_type, summary, requirements, is_active, created_at) FROM stdin;
1	Debt Recovery Officer	Recovery Operations	Mbeya (HQ)	Full-time	Handle debtor engagement, field visits and negotiated settlements for assigned portfolios. Must be persistent, professional and comfortable with both phone and in-person debtor contact.	["Diploma or degree in Business, Law, Finance or related field", "Minimum 1 year experience in debt collection or field sales", "Strong communication and negotiation skills", "Valid driving licence preferred", "Fluency in Swahili; English proficiency an advantage"]	t	2026-06-13 11:12:46.847846+03
2	Legal Officer / Court Broker	Legal & Compliance	Mbeya / Dar es Salaam	Full-time	Manage court filings, execute decrees, serve process documents and provide legal advisory support to the recovery team. Court brokerage certification is a strong advantage.	["LLB degree or Diploma in Law", "Court brokerage certification (Law School of Tanzania) preferred", "Experience in litigation or enforcement proceedings", "Attention to detail and strong documentation skills", "Ability to work independently under deadlines"]	t	2026-06-13 11:12:46.847846+03
3	Branch Operations Officer	Operations	Arusha / Dodoma / Mwanza	Full-time	Manage day-to-day branch operations, client intake, case coordination and liaison between field teams and head office.	["Degree or Diploma in Business Administration or related field", "Minimum 2 years office management or operations experience", "Proficiency in MS Office and basic computer skills", "Strong organisational and communication skills", "Knowledge of the local business environment is an advantage"]	t	2026-06-13 11:12:46.847846+03
4	Accounts & Finance Assistant	Finance	Mbeya (HQ)	Full-time	Support the finance team with bookkeeping, invoicing, payment reconciliation and financial reporting.	["Diploma or degree in Accounting, Finance or related field", "Knowledge of accounting software (QuickBooks or similar)", "Understanding of Tanzanian tax and regulatory requirements", "High level of accuracy and integrity", "CPA (T) student or certified is an advantage"]	t	2026-06-13 11:12:46.847846+03
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, email, is_active, created_at) FROM stdin;
1	test@example.com	t	2026-06-14 21:50:26.133024+03
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partners (id, name, logo_url, description, website_url, sort_order, is_active, created_at) FROM stdin;
4	Victoria Finance PLC	/uploads/partners/4_dc97640e75564b87b90a7f3a6e04a75c.png		https://victoriafinance.co.tz/	99	t	2026-06-14 21:42:11.273561+03
3	Platinum Credit Ltd	/uploads/partners/3_d819453c318d41599e8dc8954f8d8e9c.jpeg		https://platinumcredit.co.tz/	99	t	2026-06-14 21:40:11.203654+03
2	FINCA Microfinance Bank	/uploads/partners/2_542cdd6aba0145ccb593f24f27981659.png		https://finca.co.tz/	99	t	2026-06-14 21:38:11.639274+03
1	NMB Bank Plc	/uploads/partners/1_085620ea41114fd38d9a0196078996a7.jpeg		https://www.nmbbank.co.tz/	99	t	2026-06-14 21:26:03.566619+03
\.


--
-- Data for Name: process_steps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.process_steps (id, step_number, title, subtitle, description, what_you_provide, outcome, duration, icon_name, is_active, created_at) FROM stdin;
1	1	Case Submission	You submit your case	The process begins when you submit a debt recovery case to us. You provide all relevant documentation — loan agreements, invoices, contracts, correspondence and any prior communication with the debtor. Our team reviews the file to confirm it is actionable.	["Signed loan agreement or invoice", "Proof of outstanding balance", "Debtor contact details and last known address", "Any prior communication or payment history"]	Case accepted and assigned to a dedicated recovery officer within 24 hours.	1–2 business days	DocumentTextIcon	t	2026-06-13 11:12:46.880352+03
2	2	Assessment & Strategy	We analyse and plan	Our team conducts a thorough assessment of the debtor's financial position, asset base and contact details. We use skip-tracing and credit investigation tools where needed to locate debtors who have relocated or are unresponsive. A tailored recovery strategy is then prepared.	["Additional debtor background if available", "Preferred communication approach", "Any known debtor employment or business details"]	Written recovery strategy delivered to client with estimated timeline and fees.	2–5 business days	MagnifyingGlassIcon	t	2026-06-13 11:12:46.880352+03
3	3	Debtor Engagement	Professional first contact	We initiate formal contact with the debtor via written demand notice, phone call and — where necessary — a personal visit. All communication is professional, firm and legally compliant. Our goal is to secure voluntary payment at this stage without escalating to legal action.	[]	Debtor acknowledges the debt and agrees to a repayment plan, or declines — triggering the next stage.	5–14 business days	ChatBubbleLeftRightIcon	t	2026-06-13 11:12:46.880352+03
4	4	Negotiation & Settlement	Structured resolution	Where the debtor engages, we facilitate structured negotiation to reach a fair settlement — whether a lump-sum payment, instalment arrangement or partial write-down. All agreed terms are formalised in writing. Our objective is maximum recovery with minimal cost to you.	["Your minimum acceptable settlement position", "Approval of proposed repayment terms"]	Written settlement agreement signed by both parties. Recovery begins immediately.	7–21 business days	ScaleIcon	t	2026-06-13 11:12:46.880352+03
5	5	Legal Action	Court-backed enforcement	If negotiation is unsuccessful or the debtor is uncooperative, we proceed to formal legal action. Our certified court brokers and legal advisors file suit, obtain judgment and serve court process documents. We handle all court filings and hearing attendance on your behalf.	["Original signed documentation for court filing", "Authorisation letter for legal representation"]	Court judgment obtained and decree issued in your favour.	30–90 business days (court-dependent)	BuildingLibraryIcon	t	2026-06-13 11:12:46.880352+03
6	6	Recovery & Auction	Assets seized and sold	With a court decree in hand, we execute the judgment — levying distress, attaching debtor assets and conducting public auctions where required. As a licensed auctioneer under Tanzanian law, we manage the entire auction process: valuation, marketing, sale and settlement.	[]	Assets sold, proceeds applied to the debt, and balance remitted to you within agreed timelines.	14–30 business days post-judgment	BanknotesIcon	t	2026-06-13 11:12:46.880352+03
7	7	Reporting & Closure	Full transparency	At every stage of the process, you receive written updates. Upon closure, we provide a full recovery report: amounts collected, costs incurred, actions taken and any remaining balance. We maintain confidential records for your file and advise on any residual enforcement options.	[]	Comprehensive closure report delivered. Case file archived securely.	Ongoing throughout the case	ChartBarIcon	t	2026-06-13 11:12:46.880352+03
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, title, short_desc, full_desc, icon_name, category, features, tag, sort_order, is_active, created_at) FROM stdin;
4	Distress for Rent	Legal recovery of unpaid rent for landlords and property managers across Tanzania.	We assist property owners in lawfully recovering rental arrears by levying distress on tenants' goods, managing the legal process and facilitating settlement — protecting your rental income without jeopardising landlord-tenant relationships.	HomeModernIcon	core	[]	Core Service	4	t	2026-06-13 11:12:46.775285+03
5	General Brokerage	Trusted intermediaries in financial and commercial transactions.	Acting as licensed commission agents, we facilitate transactions between buyers and sellers, lenders and borrowers, and other commercial parties — ensuring terms are fair, documented and executed with professional accountability.	ArrowsRightLeftIcon	core	[]	Core Service	5	t	2026-06-13 11:12:46.775285+03
6	Skip Tracing	Locating debtors who have moved or cannot be reached through standard means.	Our investigators use legal databases, field visits and professional networks across Tanzania to trace debtors who have relocated or become unresponsive. Conducted strictly within the bounds of Tanzanian law.	MagnifyingGlassIcon	additional	[]	Specialist	6	t	2026-06-13 11:12:46.775285+03
7	Credit Investigation	In-depth investigation of creditworthiness and debtor financial standing.	We conduct thorough assessments of debtor financial positions, asset bases and business histories to inform recovery strategy and help clients make informed credit decisions.	DocumentMagnifyingGlassIcon	additional	[]	Specialist	7	t	2026-06-13 11:12:46.775285+03
8	Credit Risk Management	Advisory and tools to help clients minimise future credit exposure.	We advise clients on customer screening, contract structuring, collateral documentation and early-warning systems to reduce the flow of new non-performing loans.	ShieldExclamationIcon	additional	[]	Specialist	8	t	2026-06-13 11:12:46.775285+03
9	Debt Negotiation & Settlement	Structured negotiation between creditors and debtors for agreed repayment.	We facilitate structured negotiation to reach fair settlements — whether lump-sum payments, instalment arrangements or partial write-downs — with all terms formalised in writing.	BanknotesIcon	additional	[]	Specialist	9	t	2026-06-13 11:12:46.775285+03
10	Asset Tracing	Identification and location of debtor assets to support recovery action.	We identify and locate debtor assets — including property, vehicles, bank accounts and business interests — to support attachment, execution and auction proceedings.	CubeTransparentIcon	additional	[]	Specialist	10	t	2026-06-13 11:12:46.775285+03
11	International Debt Recovery	Cross-border recovery support for debts owed by overseas parties.	We provide cross-border recovery support for debts owed by parties who have relocated outside Tanzania, working with partner agencies and leveraging international legal instruments.	GlobeAltIcon	additional	[]	Specialist	11	t	2026-06-13 11:12:46.775285+03
1	Debt Collection	Efficient recovery of outstanding debts through legal, transparent and results-driven processes.	We pursue overdue accounts on your behalf using professional, ethical and legally compliant methods — from initial debtor contact through to full settlement. Our team handles commercial, consumer and institutional debt portfolios nationwide.	BriefcaseIcon	core	[]	Core Service	1	t	2026-06-13 11:12:46.775285+03
3	Execution of Court Orders	Professional enforcement of court judgments and decrees across Tanzania.	We hold certified competency in court brokerage and process serving (Law School of Tanzania, 2023). Our legal officers execute court decrees, enforce judgments and serve legal process documents with precision and full legal authority.	ScaleIcon	core	[]	Core Service	3	t	2026-06-13 11:12:46.775285+03
2	Public Auctions	Licensed auctioneer services ensuring fair, compliant and well-marketed property and asset sales.	As a licensed auctioneer under Tanzanian law, we conduct transparent public auctions for movable and immovable assets — including property, vehicles, equipment and goods — with full compliance, marketing and settlement support.	BuildingStorefrontIcon	core	[]	Core Service	2	t	2026-06-13 11:12:46.775285+03
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (id, key, value, category, label, updated_at) FROM stdin;
1	contact_phone	+255 762 058 614	contact	Primary Phone Number	\N
2	contact_whatsapp	+255 762 058 614	contact	WhatsApp Number	\N
3	contact_email	Office@hollyrespishers.com	contact	Main Email Address	\N
4	contact_email_alt	info@hollyrespishers.com	contact	Alternative Email	\N
5	contact_address	Plot No. 1532, Old Forest St., BOT Road	contact	Street Address	\N
6	contact_city	Mbeya	contact	City	\N
7	contact_po_box	P.O. Box 741	contact	P.O. Box	\N
8	contact_hours	Mon–Fri: 8:00am – 5:00pm	contact	Business Hours	\N
9	company_name	Hollyness & Respishers Company Limited	company	Company Name	\N
10	company_tagline	Tanzania's Premier Debt Recovery & Auctioneering Specialists	company	Tagline	\N
11	company_founded	2021	company	Founded Year	\N
12	company_reg_number	150355419	company	Registration Number	\N
13	company_license	000003633	company	Auctioneer License No.	\N
14	company_cities	5	company	Cities Count	\N
15	company_clients	10+	company	Clients Count	\N
16	company_experience	4+	company	Years of Experience	\N
17	vision	To be the leading commission agent in Tanzania, recognized for excellence in Debt Collection, Public Auctions, General Brokerage, Execution of Court Orders and Distress for Rent services.	company	Vision Statement	\N
18	mission	To provide high-quality, professional and confidential services at affordable rates, helping clients safeguard their interests and minimize financial losses, while strictly adhering to the laws and regulations of the United Republic of Tanzania.	company	Mission Statement	\N
19	social_facebook		social	Facebook URL	\N
20	social_twitter		social	Twitter / X URL	\N
21	social_linkedin		social	LinkedIn URL	\N
22	social_instagram		social	Instagram URL	\N
23	stat_recovered	TZS 313M+	general	Total Recovered (stat)	\N
24	stat_cases	500+	general	Cases Closed (stat)	\N
25	stat_success_rate	94%	general	Success Rate (stat)	\N
26	hero_bg_image		general	Hero Background Image	\N
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, department, bio, education, joined_year, photo_url, sort_order, is_active, created_at) FROM stdin;
1	Joachim Gabriel Kalungwe	Chief Executive Officer	Executive	Over 10 years of progressive experience in debt recovery, management and company leadership. Skilled in administration, client relations, and operational oversight.	BA Political Science & Public Administration	2021	\N	1	t	2026-06-13 11:12:46.802505+03
2	Getruda Audphas Myula	Managing Director	Executive	Skilled administrator ensuring governance and accountability across all company operations.	BA Public Administration	2021	\N	2	t	2026-06-13 11:12:46.802505+03
3	Godfrey Paul Chunda	Recovery Manager	Operations	Leads recovery operations with a focus on professionalism and integrity in all client engagements.	Diploma in Shipping & Port Management	2021	\N	3	t	2026-06-13 11:12:46.802505+03
4	Jerry January	Legal Advisor	Legal	Provides legal advisory, contract management, corporate governance and compliance solutions.	Master of Laws (LL.M)	2021	\N	4	t	2026-06-13 11:12:46.802505+03
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, client_name, contact_role, sector, quote, recovered, rating, is_published, created_at, updated_at, photo_url) FROM stdin;
2	Platinum Credit Ltd	Credit Manager	Microfinance	Hollyness & Respishers have been an invaluable partner in recovering our non-performing loan portfolio. Their professionalism, persistence and respect for our borrowers has made the process smooth and effective. We have seen remarkable results within short timelines.	Portfolio recovered within 60 days	5	t	2026-06-13 10:38:30.36867+03	\N	\N
3	Victoria Finance PLC	Head of Recoveries	Financial Institution	We engaged H&R for a batch of long-overdue commercial accounts. Their team conducted thorough skip tracing and debtor engagement that our internal team had exhausted. The results exceeded our expectations — over 80% of the targeted accounts reached settlement.	80%+ accounts settled	5	t	2026-06-13 10:38:30.36867+03	\N	\N
4	FINCA Microfinance Bank	Branch Operations	MFI Banking	What sets Hollyness & Respishers apart is their ethical approach. They recovered our debts without damaging our client relationships — which is critical for a microfinance institution. We continue to refer all our difficult accounts to their team.	Client relationships preserved	5	t	2026-06-13 10:38:30.36867+03	\N	\N
5	NMB Bank Plc	Legal & Compliance	Commercial Banking	H&R managed the execution of several court decrees on our behalf with precision and full compliance. Their knowledge of court processes and brokerage procedures saved us significant time and legal costs. Highly recommended for enforcement matters.	Court decrees executed on time	5	t	2026-06-13 10:38:30.36867+03	\N	\N
6	BRAC Tanzania	Country Operations	Development Finance	Their nationwide presence across five cities made them the ideal partner for our rural recovery needs. Their team in Mbeya, Dodoma and Dar es Salaam worked simultaneously on our portfolio — something no other agency we tried could offer.	Multi-city simultaneous recovery	5	t	2026-06-13 10:38:30.36867+03	\N	\N
1	Allan Mwakibinga	manager	Telecom	dbkghomxvl;bkdsr'fdlmbdopjhteroiwaebmejoiav,yhkjw'ffkhyuoi546bffi5 	5000000	5	t	2026-06-13 09:38:53.542754+03	2026-06-14 03:39:21.354006+03	\N
7	NE Microfinance Bank	Risk & Recovery Department	Banking	From the moment we submitted our case, we felt confident. The team kept us updated at every step, the documentation was impeccable, and the final recovery amounts were well above what we expected. A truly professional firm.	Above-target recovery achieved	5	t	2026-06-13 10:38:30.36867+03	2026-06-14 22:45:19.438295+03	/uploads/testimonials/7_7ab9e03cdec248e393fb2dc2b29b25a6.png
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, full_name, hashed_password, is_active, is_admin, created_at, updated_at) FROM stdin;
1	admin@hollyrespishers.com	H&R Admin	$2b$12$vGQUWQXRSwrPGTyr8JNGNOveNyk3d2ywJXiFBkVuFi9VqDHCJ67F6	t	t	2026-06-13 08:55:37.563842+03	\N
\.


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 9, true);


--
-- Name: career_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_applications_id_seq', 1, true);


--
-- Name: contact_inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_inquiries_id_seq', 1, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faqs_id_seq', 17, true);


--
-- Name: industries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.industries_id_seq', 11, true);


--
-- Name: job_openings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_openings_id_seq', 4, true);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 1, true);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_id_seq', 4, true);


--
-- Name: process_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.process_steps_id_seq', 7, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 11, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 26, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.team_members_id_seq', 4, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: career_applications career_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_applications
    ADD CONSTRAINT career_applications_pkey PRIMARY KEY (id);


--
-- Name: contact_inquiries contact_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: job_openings job_openings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: process_steps process_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.process_steps
    ADD CONSTRAINT process_steps_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_blog_posts_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_blog_posts_id ON public.blog_posts USING btree (id);


--
-- Name: ix_blog_posts_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_blog_posts_slug ON public.blog_posts USING btree (slug);


--
-- Name: ix_career_applications_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_career_applications_id ON public.career_applications USING btree (id);


--
-- Name: ix_contact_inquiries_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_contact_inquiries_id ON public.contact_inquiries USING btree (id);


--
-- Name: ix_faqs_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_faqs_id ON public.faqs USING btree (id);


--
-- Name: ix_industries_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_industries_id ON public.industries USING btree (id);


--
-- Name: ix_job_openings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_job_openings_id ON public.job_openings USING btree (id);


--
-- Name: ix_newsletter_subscribers_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_newsletter_subscribers_email ON public.newsletter_subscribers USING btree (email);


--
-- Name: ix_newsletter_subscribers_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_newsletter_subscribers_id ON public.newsletter_subscribers USING btree (id);


--
-- Name: ix_partners_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_partners_id ON public.partners USING btree (id);


--
-- Name: ix_process_steps_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_process_steps_id ON public.process_steps USING btree (id);


--
-- Name: ix_services_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_services_id ON public.services USING btree (id);


--
-- Name: ix_site_settings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_site_settings_id ON public.site_settings USING btree (id);


--
-- Name: ix_site_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_site_settings_key ON public.site_settings USING btree (key);


--
-- Name: ix_team_members_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_team_members_id ON public.team_members USING btree (id);


--
-- Name: ix_testimonials_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_testimonials_id ON public.testimonials USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- PostgreSQL database dump complete
--

