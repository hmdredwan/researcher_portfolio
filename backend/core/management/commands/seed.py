"""Seed the database with an admin user and realistic sample content.

Run with:  python manage.py seed
"""
from django.core.management.base import BaseCommand
from core.models import AdminUser, Researcher, Paper, Book, Article


class Command(BaseCommand):
    help = "Seed the database with the admin user and sample content."

    def handle(self, *args, **options):
        # --- Admin user (idempotent: reset password if exists)
        admin, created = AdminUser.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@gmail.com"},
        )
        admin.email = "admin@gmail.com"
        admin.set_password("admin123")
        admin.token = None
        admin.save()
        self.stdout.write(self.style.SUCCESS(
            f"Admin user ready → username: admin / password: admin123"
        ))

        # --- Researcher profile
        Researcher.objects.all().delete()
        Researcher.objects.create(
            name="AKM Mehedi Hasan",
            title="Researcher & Educator in Computer Science",
            tagline="Exploring the frontiers of artificial intelligence, machine learning, and human-centered computing.",
            bio=(
                "I am a researcher passionate about building intelligent systems that work "
                "for people. My work spans machine learning, natural language processing, "
                "and applied AI in domains ranging from healthcare to education. I believe "
                "the best research is both rigorous and useful — pushing the boundaries of "
                "what is known while solving real problems.\n\n"
                "Beyond research, I enjoy teaching, mentoring the next generation of "
                "computer scientists, and writing about the ideas that shape our field. "
                "I hold a deep interest in making complex topics accessible to broad "
                "audiences through articles, talks, and open educational materials."
            ),
            email="mehedi.hasan@example.com",
            location="Dhaka, Bangladesh",
            website="https://example.com",
            scholar_url="https://scholar.google.com",
            github_url="https://github.com",
            linkedin_url="https://linkedin.com",
            twitter_url="https://twitter.com",
        )
        self.stdout.write(self.style.SUCCESS("Researcher profile seeded."))

        # --- Papers
        Paper.objects.all().delete()
        papers = [
            {
                "title": "Adaptive Learning Rates for Robust Deep Network Training",
                "authors": "AKM Mehedi Hasan, Sarah Chen",
                "abstract": (
                    "We propose an adaptive learning-rate scheduling method that improves "
                    "convergence stability across a wide range of architectures. "
                    "Experiments on standard benchmarks demonstrate faster training and "
                    "higher final accuracy compared to established optimizers."
                ),
                "year": 2025,
                "venue": "Journal of Machine Learning Research",
                "doi": "10.5555/jmlr.2025.0001",
                "tags": "Machine Learning, Optimization, Deep Learning",
                "featured": True,
            },
            {
                "title": "A Transformer-Based Approach to Low-Resource Translation",
                "authors": "AKM Mehedi Hasan, M. Rahman, L. Park",
                "abstract": (
                    "This work addresses the challenge of neural machine translation for "
                    "low-resource languages. By leveraging cross-lingual transfer and "
                    "data augmentation, our model achieves competitive BLEU scores with "
                    "limited parallel corpora."
                ),
                "year": 2024,
                "venue": "Proceedings of ACL",
                "doi": "10.5555/acl.2024.0042",
                "tags": "NLP, Transformers, Machine Translation",
                "featured": True,
            },
            {
                "title": "Explainable AI for Clinical Decision Support",
                "authors": "AKM Mehedi Hasan, J. Okafor",
                "abstract": (
                    "We introduce an interpretable framework for clinical risk prediction "
                    "that combines gradient-boosted trees with locally faithful "
                    "explanations, enabling clinicians to understand and trust model "
                    "recommendations."
                ),
                "year": 2024,
                "venue": "IEEE Journal of Biomedical and Health Informatics",
                "doi": "10.5555/ieee.jbhi.2024.0117",
                "tags": "AI, Healthcare, Explainable AI",
                "featured": False,
            },
            {
                "title": "Federated Learning under Heterogeneous Data Distributions",
                "authors": "AKM Mehedi Hasan, T. Nakamura",
                "abstract": (
                    "Heterogeneity across clients remains a core challenge for federated "
                    "learning. We present a personalization-aware aggregation scheme that "
                    "reduces client drift and improves local model performance."
                ),
                "year": 2023,
                "venue": "NeurIPS Workshop on Federated Learning",
                "doi": "",
                "tags": "Federated Learning, Distributed Systems, Privacy",
                "featured": False,
            },
            {
                "title": "Efficient Vision Transformers for Edge Devices",
                "authors": "AKM Mehedi Hasan, A. Gupta",
                "abstract": (
                    "Deploying vision transformers on edge hardware demands careful "
                    "trade-offs between accuracy and latency. Our lightweight variant "
                    "achieves near-state-of-the-art accuracy at a fraction of the "
                    "computational cost."
                ),
                "year": 2023,
                "venue": "CVPR",
                "doi": "10.5555/cvpr.2023.0888",
                "tags": "Computer Vision, Transformers, Edge Computing",
                "featured": True,
            },
            {
                "title": "A Survey on Responsible Machine Learning",
                "authors": "AKM Mehedi Hasan",
                "abstract": (
                    "This survey synthesizes recent advances in fairness, accountability, "
                    "and transparency in machine learning, and outlines open challenges "
                    "for practitioners seeking to deploy responsible AI systems."
                ),
                "year": 2022,
                "venue": "ACM Computing Surveys",
                "doi": "10.5555/acm.csur.2022.0003",
                "tags": "Survey, Responsible AI, Fairness",
                "featured": False,
            },
        ]
        Paper.objects.bulk_create([Paper(**p) for p in papers])
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(papers)} papers."))

        # --- Books
        Book.objects.all().delete()
        books = [
            {
                "title": "Practical Machine Learning: A Hands-On Guide",
                "authors": "AKM Mehedi Hasan",
                "description": (
                    "A project-driven introduction to modern machine learning, from the "
                    "fundamentals of supervised learning to deploying models in production."
                ),
                "year": 2024,
                "publisher": "O'Reilly Media",
                "link": "https://example.com/book/practical-ml",
            },
            {
                "title": "Deep Learning Demystified",
                "authors": "AKM Mehedi Hasan, L. Park",
                "description": (
                    "An accessible journey through neural networks, blending intuition, "
                    "mathematics, and code so readers can both understand and build."
                ),
                "year": 2023,
                "publisher": "Manning Publications",
                "link": "https://example.com/book/demystified",
            },
            {
                "title": "Data Science for Good",
                "authors": "AKM Mehedi Hasan",
                "description": (
                    "How data science can drive social impact, with case studies in "
                    "healthcare, education, and environmental sustainability."
                ),
                "year": 2022,
                "publisher": "Springer",
                "link": "https://example.com/book/data-for-good",
            },
            {
                "title": "Foundations of Artificial Intelligence",
                "authors": "AKM Mehedi Hasan, J. Okafor",
                "description": (
                    "A comprehensive textbook covering search, reasoning, learning, and "
                    "the ethical considerations that shape modern AI."
                ),
                "year": 2021,
                "publisher": "MIT Press",
                "link": "https://example.com/book/foundations-ai",
            },
        ]
        Book.objects.bulk_create([Book(**b) for b in books])
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(books)} books."))

        # --- Articles
        Article.objects.all().delete()
        articles = [
            {
                "title": "Why Interpretability Matters More Than Ever",
                "slug": "why-interpretability-matters",
                "excerpt": (
                    "As AI systems are entrusted with higher-stakes decisions, the ability "
                    "to understand their reasoning moves from a nice-to-have to a necessity."
                ),
                "body": (
                    "Interpretability is the bridge between raw predictive power and real-world trust. "
                    "In this article, we explore why transparent models are essential, the techniques "
                    "that make black-box systems legible, and how teams can bake explainability into "
                    "their development workflow.\n\n"
                    "We begin with the core tension: accuracy versus interpretability. Historically, "
                    "these were seen as opposing forces — the most accurate models were the least "
                    "understandable. Modern approaches show this is no longer strictly true.\n\n"
                    "Techniques such as LIME, SHAP, and attention visualization have matured into "
                    "practical tools. The frontier now is making interpretability a first-class "
                    "concern in system design, not an afterthought."
                ),
                "published": True,
            },
            {
                "title": "Getting Started with Federated Learning",
                "slug": "getting-started-federated-learning",
                "excerpt": (
                    "A practical introduction to training models across decentralized data "
                    "without ever moving it to a central server."
                ),
                "body": (
                    "Federated learning flips the traditional training paradigm. Instead of "
                    "centralizing data, we bring the model to the data — training locally on "
                    "devices and sharing only updates.\n\n"
                    "This article walks through the motivation, the core algorithm, and a minimal "
                    "implementation. We also discuss the challenges of data heterogeneity, "
                    "communication cost, and privacy guarantees that drive current research."
                ),
                "published": True,
            },
            {
                "title": "The Myth of Objective Data",
                "slug": "myth-of-objective-data",
                "excerpt": (
                    "Datasets are not neutral. Recognizing their biases is the first step "
                    "toward building fairer systems."
                ),
                "body": (
                    "Every dataset encodes choices — what was collected, what was excluded, and "
                    "how it was labeled. Treating data as ground truth hides these decisions and "
                    "the biases they carry.\n\n"
                    "Here we examine how dataset bias enters ML systems, the harms it can cause, "
                    "and concrete practices for auditing and improving the data we rely on."
                ),
                "published": True,
            },
            {
                "title": "Research Notes: Writing Papers That Get Read",
                "slug": "writing-papers-that-get-read",
                "excerpt": (
                    "Lessons learned about clarity, structure, and storytelling in academic writing."
                ),
                "body": (
                    "Good research deserves good writing. This piece distills practical advice on "
                    "framing contributions, structuring arguments, and editing for clarity.\n\n"
                    "The best papers tell a story: they motivate a problem, present a solution, and "
                    "connect findings to a bigger picture. We close with a checklist I use before "
                    "submitting any manuscript."
                ),
                "published": True,
            },
        ]
        Article.objects.bulk_create([Article(**a) for a in articles])
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(articles)} articles."))

        self.stdout.write(self.style.SUCCESS("\nAll done. Run the server: python manage.py runserver"))
