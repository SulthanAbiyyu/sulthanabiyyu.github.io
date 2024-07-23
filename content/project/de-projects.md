---
title: "Catalogs of Data Engineering Projects"
date: 2024-07-20T17:06:01+07:00
draft: false
weight: 1
math: true
cover:
  image: "img in static"
---

Since 8 months ago, I began learning everything I could find about Data Engineering. I've consumed a lot of information on the topic from books, blogs, videos, courses, and forums. I’ve learned about the fundamentals, data warehousing, and data movement techniques like ETL and ELT. It has been quite a challenge, but also a lot of fun! There’s still so much more I want to explore. Data Engineering involves a multitude of tools, and I'm curious about every one of them.

A wise person on the internet once said, "By the time you master a Data Engineering tool, it will soon become obsolete." Because of this, I want to understand the philosophy behind these tools, not the technicallity: What are they about? Why are they useful? What are their drawbacks? When should they be used or avoided? Can they be combined with other tools? How is the license? How scalable are they? What kind of support and community resources are available? How easy are they to integrate with existing systems? What is the learning curve like? What kind of performance can be expected? How secure are they? What are the long-term maintenance requirements?

This post will document my journey as I experiment with these tools through various projects. I will focus on my thoughts on the tools and concepts, how I approach problems, and why I choose to use specific tools.

## 1. [First Impressions: Exploring common DE tools](https://github.com/SulthanAbiyyu/belajar-de/)

{{< details title="**Tools used:**">}}

- Docker
- Airflow
- DBT
- Snowflake
- Kafka
- Mongo
- BigQuery
- Postgres
- Terraform
  {{< /details >}}

{{< details >}}
This project is essentially an introduction to various common data engineering (DE) tools. I experimented with tools for containerization, orchestration, transformation, data warehousing, stream processing, SQL and NoSQL databases, and Infrastructure as Code (IAC). I will explain my thoughts and impressions thoroughly in this first section.

The first tool I tried was Airflow. Why? Because if you search for popular DE tools, Airflow appears in almost every blog that pops up. I used Docker for convenience of installation and setup. It was quite easy since there is already an image for it. All I needed to do was initialize the Airflow database, create a user, and run the webserver and scheduler. I also copied a simple DAG script from a book that ingests rocket launches data. In this experiment, I learned about DAG scripting and familiarized myself with the Airflow UI. I found the UI straightforward and informative; I liked that we could see past run statuses easily from the main dashboard. I also appreciated the DAG visualization, which provided a clear idea of how the data would move. This visualization also allows for double-checking our script.

Next, I explored DBT for transformation and Snowflake as a data lake and data warehouse. I didn't do much here, but I learned how to set up the connection between these two, create data models, and navigate the Snowflake UI. Snowflake has a neat, easy-to-understand UI. Creating databases, users, permissions, and even managing the compute engine can be done using declarative SQL, which I am already familiar with. My impression of DBT was "wow, this is too overpowered" for my simple use case. However, I can see the appropriate use cases as DBT offers a lot. I liked that we could use Jinja in DBT and run tests. There are predefined tests for common scenarios like checking for non-null values and data types. I also discovered that DBT has many extensions, which was somewhat overwhelming. I noticed people using the auto surrogate key generator, which looks helpful. I can't wait to explore more about DBT!

I had no practical experience with streaming data; I only knew about it from textbooks, which always gave me a boring impression since it seemed difficult. However, after following an online tutorial about Kafka, I could think of many possible use cases. I considered using Kafka for a sensor monitor stream processing engine. I was also relieved to learn that Kafka has a Python API, allowing me to create Kafka consumer and producer scripts using my preferred programming language, Python. In the project, I created a dummy streaming data source, caught it using a consumer, and saved it into object storage using MinIO.

Next, I learned about setting up MongoDB as a NoSQL database. I created a super simple CRUD application to capture user data. The queries seemed unusual to me, but that was likely due to my unfamiliarity. There's not much more to say about this.

The last part of my project involved my first "real" project to ingest big data and perform ETL from source to destination. First, I downloaded the dataset using wget and saved it as a CSV. Then, I connected to PostgreSQL and inserted all the data using chunking. After that, I created a BigQuery and GCP bucket instance using Terraform as an IAC tool. Then, I performed ETL from PostgreSQL to BigQuery using Mage as the orchestration tool. The last step was to optimize the query by utilizing clustering and partitioning. I preferred Mage's UI over Airflow's because it looked cooler and was easier to use. However, Mage's community is small, so I had difficulty setting things up and getting answers. Luckily, I found a random comment on YouTube that somehow fixed my problem. I found BigQuery to be quite similar to Snowflake, so adapting was easy. I like the idea of terraform that guarantee a repeatability and reusability for creating a cloud infrastructures. I also found that terraform variables helps me to manage constants easier. 

Through this experiment, I gained a good grasp of common DE tools and understood why these tools are essential for helping me streamline and optimize data engineering processes. I am excited to delve deeper into each tool and apply them to more complex projects in the future.

{{< /details >}}

## 2. [Batch Big Data Processing](https://github.com/SulthanAbiyyu/duckdb-spark-pandas-postgre)

{{< details title="**Tools used:**">}}

- Docker
- Postgres
- DuckDB
- Apache Spark
  {{< /details >}}

{{< details >}}

> Under construction.. 🚧👷‍♂️
> {{< /details >}}

## 3. [AWS Data Stack](https://www.credly.com/badges/220c6a8a-30a0-4072-8aa2-43cbf72a8ea7/public_url)

{{< details title="**Tools used:**">}}

- Athena
- S3
- Glue
- Redshift
- EMR Clusters
- Kinesis Data Stream and Firehose
- Step Functions
  {{< /details >}}

{{< details >}}

> Under construction.. 🚧👷‍♂️
> {{< /details >}}

## 4. [Reverse Proxy, Load Balancing, and Stress Test](https://github.com/SulthanAbiyyu/stress-test-arggh)

{{< details title="**Tools used:**">}}

- Nginx
- Locust
- Docker
- FastAPI
  {{< /details >}}

{{< details >}}

> Under construction.. 🚧👷‍♂️
> {{< /details >}}
