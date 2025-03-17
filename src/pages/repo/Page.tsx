import { useRef, useMemo, useState } from 'react'; // useEffect
import { useDocumentTitle } from "@refinedev/react-router";
import { HttpError, useOne, useParsed } from "@refinedev/core";
import { Col, Button, Popover, Input, Space, Divider, Badge } from 'antd';
import { BsLink45Deg, BsStarFill, BsEye, BsDownload } from 'react-icons/bs';
import { MarkdownView } from '@/components/MarkdownView';
import { SpeechContent } from '@/components/SpeechContent';
import { useMode } from "@/contexts/color-mode";
import { numShort, parseDate, parseNumber } from '@/utils';

const githubUrl = "https://github.com/";

export default function Page(){
  const { params: { owner, repo } } = useParsed<any>();
  const { mode } = useMode();
  const contentRef: any = useRef();
  const [mountMarkdown, setMountMarkdown] = useState<any>(false);

  useDocumentTitle("Repo | " + import.meta.env.VITE_APP_NAME);

  const isEnabled = !!owner && !!repo;

  const sameProps = {
    queryOptions: {
      enabled: isEnabled
    },
    resource: "/repos/{owner}",
    meta: { owner, repo },
  };

  const {
    data,
    isLoading,
    isFetching,
    isRefetching,
  } = useOne<any, HttpError>({
    // /repos/{owner}/{repo}
    ...sameProps,
    id: "{repo}"
  });

  let detail = data?.data || {};
  let loadingData = isEnabled && (isLoading || isFetching || isRefetching);

  const {
    data: dataReadme,
    isLoading: isLoadingReadme,
    isFetching: isFetchingReadme,
    isRefetching: isRefetchingReadme,
  } = useOne<any, HttpError>({
    // /repos/{owner}/{repo}/readme/{dir}
    ...sameProps,
    id: "{repo}/readme",
    
  });

  let loadingReadme = isEnabled && (isLoadingReadme || isFetchingReadme || isRefetchingReadme);

  const markdown = useMemo(() => {
    if(dataReadme?.data){
      return atob(dataReadme.data.content || '');
    }
    return '';
  }, [dataReadme]);

  const copyToClipboard = (e: any) => {
    const input = e.target.previousElementSibling;

    input.focus();
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    navigator?.clipboard?.writeText?.(input.value);
  }

  return (
    <Col 
      lg={16} 
      xs={24} 
      className="mx-auto py-4"
    >
      {!!markdown && mountMarkdown && (
        <SpeechContent
          text={contentRef.current?.innerText || ''}
          className={(mode === 'dark' ? "bg-gray-700 border-gray-700" : "bg-white border-gray-200") + " border shadow sticky top-14 left-0 right-0 z-1031 p-1 mb-6 lg:mx-0 lg:mt-0 -mx-4 -mt-4"}
        />
      )}

      {!!detail && (
        <article>
          <h1 className="text-3xl font-normal! break-all">
            <a
              href={detail.owner?.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                draggable={false}
                alt={owner}
                src={detail.owner?.avatar_url}
                className="inline-block rounded mr-4 w-8 h-8"
              />
              {owner}
            </a>
            <span className="mx-1">/</span>
            <a
              href={detail.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repo}
            </a>
            <Badge 
              color="blue" 
              count={detail.private ? 'Private' : 'Public'} 
              className="ml-2!"
            />
          </h1>

          <div className="text-xs mt-2">
            <span className={(mode === 'dark' ? "bg-gray-500" : "bg-gray-200") + " inline-block py-1 px-2 rounded mb-1"}>
              Created at: <time dateTime={detail.created_at}>{parseDate(detail.created_at)}</time>
            </span>
            <span className={(mode === 'dark' ? "bg-gray-500" : "bg-gray-200") + " inline-block py-1 px-2 rounded bg-gray-200 mb-1 mx-1"}>
              Updated at: <time dateTime={detail.updated_at}>{parseDate(detail.updated_at)}</time>
            </span>
            <span className={(mode === 'dark' ? "bg-gray-500" : "bg-gray-200") + " inline-block py-1 px-2 rounded bg-gray-200 mb-1"}>
              Pushed at: <time dateTime={detail.pushed_at}>{parseDate(detail.pushed_at)}</time>
            </span>
          </div>

          <div className="my-5 flex flex-col lg:flex-row flex-wrap gap-2">
            <Button
              href={`${githubUrl}${owner}/${repo}/watchers`}
              target="_blank"
              rel="noopener noreferrer"
              title={detail.watchers_count ? parseNumber(detail.watchers_count) + ' watchers' : ''}
              className="flex items-center gap-x-2"
            >
              <BsEye />
              Watch
              <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
                {detail.watchers_count ? numShort(detail.watchers_count) : 0}
              </b>
            </Button>
            <Button
              href={`${githubUrl}${owner}/${repo}/forks`}
              target="_blank"
              rel="noopener noreferrer"
              title={detail.forks_count ? parseNumber(detail.forks_count) + ' forks' : ''}
              className="flex items-center gap-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
              </svg>
              Fork
              <b className="border border-gray-400 px-2 rounded-lg ml-auto">
                {detail.forks_count ? numShort(detail.forks_count) : 0}
              </b>
            </Button>
            <Button
              href={`${githubUrl}${owner}/${repo}/stargazers`}
              target="_blank"
              rel="noopener noreferrer"
              title={detail.stargazers_count ? parseNumber(detail.stargazers_count) + ' Stars' : ''}
              className="flex items-center gap-x-2"
            >
              <BsStarFill />
              Starred
              <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
                {detail.stargazers_count ? numShort(detail.stargazers_count) : 0}
              </b>
            </Button>

            <Popover
              placement="bottomLeft"
              trigger={["click"]}
              content={
                <>
                  <h6>Clone</h6>
                  {
                    [
                      { label: "HTTPS", value: detail.clone_url },
                      { label: "SSH", value: detail.ssh_url },
                      { label: "GitHub CLI", value: 'gh repo clone ' + detail.full_name },
                    ].map((item: any, idx: number) =>
                      <div key={item.label} className="py-2">
                        <label htmlFor={"cloneInput" + idx}>{item.label}</label>
                        <Space.Compact className="mt-1 w-full">
                          <Input
                            readOnly
                            defaultValue={item.value}
                            // onMouseUp={selectAll}
                            className="truncate"
                            id={"cloneInput" + idx}
                          />
                          <Button onClick={copyToClipboard}>Copy</Button>
                        </Space.Compact>
                      </div>
                    )
                  }
                  
                  <Button
                    href={`${githubUrl}${owner}/${repo}/archive/refs/heads/${detail.default_branch}.zip`}
                    download
                    block
                    icon={<BsDownload />}
                    className="mt-4"
                  >
                    Download ZIP
                  </Button>
                </>
              }
            >
              <Button>
                Code
              </Button>
            </Popover>
          </div>

          <Divider />

          {!!detail.description && <p className="text-lg">{detail.description}</p>}

          {!!detail.homepage && (
            <a href={detail.homepage} target="_blank" rel="noopener noreferrer" className="font-semibold break-all">
              <BsLink45Deg /> {detail.homepage}
            </a>
          )}

          {!!detail?.topics?.length && (
            <p className="flex flex-row flex-wrap gap-2 mt-5 font-semibold text-xs">
              {detail.topics.map((item: string) =>
                <a
                  key={item}
                  href={`${githubUrl}topics/${item}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2 rounded-xl bg-blue-200"
                >
                  {item}
                </a>
              )}
            </p>
          )}

          <section 
            ref={contentRef} 
            className="my-5"
          >
            {!loadingData && !loadingReadme && !!markdown && (
              <MarkdownView 
                className="my-5"
                onMounted={() => setMountMarkdown(true)}
              >
                {markdown}
              </MarkdownView>
            )}
          </section>
        </article>
      )}
    </Col>
  );
}
