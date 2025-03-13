import { apiBaseUrl } from '../../../app/base.ts'
import { append, partition, remove } from '../../../common/utils/array-utils.ts'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { useEffect, useMemo, useState } from 'react'
import { Resource, Setting } from '../model.ts'
import { isNotPresent } from '../../../common/utils/utils.ts'


/**
 * Manages main settings, value settings and resources.
 *
 * Provides:
 * @property mainSettings array.
 * @property valueSettings array.
 * @property resources array.
 * @property addSetting add a main setting or a value setting.
 * @property deleteSetting delete a main setting or a value setting.
 * @property addResource add a resource.
 * @property deleteResource delete a resource.
 */
export function useDocumentSettings() {

    const { getAuthHttp } = useAuth()

    const [settings, setSettings] = useState<Setting[]>([])
    const [resources, setResources] = useState<Resource[]>([])

    const [mainSettings, valueSettings] =
        useMemo(() => partition(setting => setting.type === 'MAIN', settings), [settings])

    useEffect(() => {
        loadSettings()
        loadResources()
    }, [])

    async function loadSettings() {
        const response = await getAuthHttp().get<Setting[]>(`${apiBaseUrl}/embedding_manager/settings`)
        setSettings(response.data)
    }

    async function loadResources() {
        const response = await getAuthHttp().get<Resource[]>(`${apiBaseUrl}/embedding_manager/resources`)
        setResources(response.data)
    }


    async function addSetting(file: File) {
        const response = await uploadFile<Setting>(file, 'settings')
        if (isNotPresent(response)) return

        loadSettings()
    }

    async function addResource(file: File) {
        const response = await uploadFile<Resource>(file, 'resources')
        if (isNotPresent(response)) return

        setResources(prevState => append(response.data, prevState))
    }

    async function deleteSetting(id: string) {
        await getAuthHttp().delete(`${apiBaseUrl}/embedding_manager/settings/${id}`)
        setSettings(prevState => remove(id, prevState))
    }

    async function deleteResource(id: string) {
        await getAuthHttp().delete(`${apiBaseUrl}/embedding_manager/resources/${id}`)
        setResources(prevState => remove(id, prevState))
    }


    async function uploadFile<R>(file: File, pathEnding: string) {
        const formData = new FormData()
        formData.append('file', file)

        try {
            return await getAuthHttp().post<R>(`${apiBaseUrl}/embedding_manager/${pathEnding}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }


    return {
        mainSettings,
        valueSettings,
        resources,
        addSetting,
        deleteSetting,
        addResource,
        deleteResource,
    }
}
