/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "@app/components/v2";
import { CreateSendSecretForm } from "@app/views/SendSecret/components/CreateSendSecretForm";

export default function SendSecret() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("common.head-title", { title: t("settings.org.title") })}</title>
                <link rel="icon" href="/infisical.ico" />
            </Head>
            <div className="container mx-auto flex flex-col justify-between bg-bunker-800 text-white">
                <div className="mb-6 w-full py-6 px-6 max-w-7xl mx-auto">
                    <p className="mr-4 mb-4 text-3xl font-semibold text-white">
                        Send Secrets
                    </p>
                    <div className="mb-6 text-lg text-mineshaft-300">
                        A secure and efficient way to share text-based sensitive information with intended recipients
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <div className="w-2/5">
                            <Input
                                className="bg-mineshaft-800 placeholder-mineshaft-50 duration-200 focus:bg-mineshaft-700/80"
                                placeholder="Search by folder name, key name, comment..."
                                leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                            />
                        </div>
                        <div className="flex-grow"/>
                        <div className="flex items-center mr-20">
                            <Button
                                variant="outline_bg"
                                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                className="rounded-r-none h-10"
                            >
                                Add Secret
                            </Button>
                        </div>
                    </div>
                    <div className="mt-3 overflow-y-auto overflow-x-hidden thin-scrollbar bg-mineshaft-800 text-left text-bunker-300 rounded-md text-sm">
                        <div className="flex flex-col" id="dashboard">
                            <div className="flex font-medium border-b border-mineshaft-600">
                                <div style={{ width: "2.8rem" }} className="px-4 py-3 flex-shrink-0" />
                                <div
                                className="w-80 flex-shrink-0 border-r flex items-center border-mineshaft-600 px-4 py-2"
                                role="button"
                                tabIndex={0}
                                >
                                Key
                                <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="ml-2"
                                />
                                </div>
                            <div className="flex-grow px-4 py-2">Value</div>
                            </div>      
                        </div>
                    </div>
                    <CreateSendSecretForm />
                </div>
            </div>
        </>
    );
}

Object.assign(SendSecret, { requireAuth: true });
