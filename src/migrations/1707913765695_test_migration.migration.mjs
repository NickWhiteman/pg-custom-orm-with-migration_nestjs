export const up = `
                CREATE TABLE IF NOT EXISTS public.wallet_table
                (
                  id integer NOT NULL  GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),private_key text NOT NULL  COLLATE pg_catalog."default",is_delete smallint NOT NULL,create_at timestamp without time zone,update_at timestamp without time zone,
                  CONSTRAINT pk_wallet_table PRIMARY KEY (id)
                )
                WITH (
                    OIDS = FALSE
                )
                TABLESPACE pg_default;
          
                ALTER TABLE IF EXISTS public.wallet_table
                    OWNER to postgres;
              `;
            
            export const down = `
                DROP TABLE wallet_table
              `;