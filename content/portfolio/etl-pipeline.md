---
title: "Batch big data ETL"
subtitle: "DuckDB, Spark, Pandas, Postgres"
summary: "A dockerized ETL pipeline with star-schema dimensional modeling, built to compare processing engines."
group: lab
weight: 50
period: "2024"
stack: ["DuckDB", "Spark", "Postgres", "Docker"]
links:
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/duckdb-spark-pandas-postgre"
  - name: "Full write-up"
    url: "/portfolio/data-engineering/"
---

An ETL pipeline that deliberately mixes engines so I could feel the difference
between them rather than read about it:

- **DuckDB** as the SQL engine, reading CSVs and moving data into Postgres
- **Pandas or Spark** as the processing engine — both paths implemented, so they
  can be compared on the same data
- **Postgres** as both data lake (`landing` schema) and warehouse (`marts`)
- **Kimball-style star schema** for the dimensional model
- Everything dockerized

## What I learned

DuckDB was the surprise. Loading millions of rows was fast, handing data to
Postgres was a single SQL statement, and converting into Pandas or Spark was
seamless. It removed most of the friction I expected to spend the evening on.

It was also the first time the star schema stopped being a diagram in a book and
became obviously useful — aggregations collapsed to a single join, and building a
proper `date` dimension made time-based queries trivial instead of fiddly.

Not everything worked. Adding foreign key constraints through DuckDB's Postgres
extension failed — `add constraints` is not implemented — so the relationships
get altered in Postgres directly. Worth knowing before you plan around it.

The longer write-up, covering Airflow, DBT, Snowflake, Kafka, Terraform, and the
AWS data stack, is [here]({{< ref "data-engineering" >}}).
